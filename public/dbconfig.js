module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "scott",

    password      : process.env.NODE_ORACLEDB_PASSWORD || "Tiger",

    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/TRNG",

    port           : "8850"

};