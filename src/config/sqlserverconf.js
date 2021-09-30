    //Connect to sql server config
    //String raw method declear backslash "\" as string
    const servername = String.raw`your server name`
    const config = {
      server: servername,
      port:1433,
      user: 'your user name',
      password: 'your password',
      database: 'your databse name',
      options: {
        encrypt: false,
      },
      connectionTimeout: 150000,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    }


module.exports = config


      
   