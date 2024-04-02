const { randomBytes } = require("crypto")
const fs = require("fs")

function create(data) {

    const id = randomBytes(100).toString("base64url")
    const password = randomBytes(100).toString("base64url")

    fs.writeFileSync(`data/${id}.data`, data, "binary")
    fs.writeFileSync(`data/${id}.password`, password, "binary")

    return { id, password }

}

function write(id, password, data) {

    var id = id.split(".").join("").split("/").join("").split("\\").join("")

    if (!fs.existsSync(`data/${id}.password`)) {
        return
    }

    const isAuth = fs.readFileSync(`data/${id}.password`, "binary") == password

    if (!isAuth) {
        return
    }

    fs.writeFileSync(`data/${id}.data`, data, "binary")

    return `edited\nid       => ${id}\npassword => ${password}`

}

function read(id, password) {

    var id = id.split(".").join("").split("/").join("").split("\\").join("")

    if (!fs.existsSync(`data/${id}.password`)) {
        return
    }

    const isAuth = fs.readFileSync(`data/${id}.password`, "binary") == password

    if (!isAuth) {
        return
    }

    return fs.readFileSync(`data/${id}.data`, "binary")

}

require("http").createServer((req, res) => {

    const { pathname, searchParams } = new URL(`http:localhost${req.url}`)

    if (pathname == "/") {

        res.setHeader("content-type", "text/html")
        res.end(fs.readFileSync("index.html"))

    }
    else if (pathname == "/create") {

        const { id, password } = create(searchParams.get("content"))

        res.setHeader("content-type", "text/plain")
        res.end(`id       => ${id}\npassword => ${password}`)

    }

    else if (pathname == "/read") {

        res.setHeader("content-type", "text/plain")
        res.end(read(searchParams.get("id"), searchParams.get("password")))

    }

    else if (pathname == "/write") {

        res.setHeader("content-type", "text/plain")
        res.end(write(searchParams.get("id"), searchParams.get("password"), searchParams.get("content")))

    }

    else {
        res.end("404")
    }

}).listen(80)