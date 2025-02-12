require('dotenv').config()

function variable(variable) {
    return process.env[variable]
}

module.exports = {
    variable
}