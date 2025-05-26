import pool from '../db';

export async function getMembers() {
  const { rows } = await pool.query('SELECT * FROM members');
  return rows;
}
