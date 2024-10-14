/* Week 4 - Learning Activity 1 - Step 4 */
const pool = require('../database/')

/* ***************************
*  Register New Account
* ************************** */
async function registerAccount (account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `INSERT INTO account (account_firstname, account_lastname, 
            account_email, account_password, account_type) 
            VALUES ($1, $2, $3, $4, 'Client') 
            RETURNING *`
        
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    }
    catch (error) {
        return error.message
    }
}

/* ***************************
*  Check for Existing Email in DB
*  Week 4 - Team Activity - Step 4
* ************************** */
async function checkExistingEmail (account_email) {
    try {
        const sql = `SELECT * FROM account WHERE account_email = $1`
        const email = await pool.query(sql, [account_email])

        return email.rowCount
    } 
    catch (error) {
        return error.message
    }
}

/* ***************************
*  Return account data using email address
*  Week 5 - Learning Activity 1 - Step 2
* ************************** */
async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
            `SELECT account_id, account_firstname, account_lastname, account_email, 
                account_type, account_password 
            FROM account 
            WHERE account_email = $1`,
            [account_email])

        return result.rows[0]
    } 
    catch (error) {
        return new Error("No matching email found")
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail }