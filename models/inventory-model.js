const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 *  Week 3 - Learning Activity 1 Step 3
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  }
  catch (error) {
    console.error("getInventoryByClassificationsId error" + error)
  }
}

/* ***************************
 *  Get single inventory item by inv_id
 *  Assignment 3 Task 1 - #2 > #3
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = ${inv_id}`
    )
    return data.rows[0]
  }
  catch (error) {
    console.error("getInventoryByInvId error" + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId}