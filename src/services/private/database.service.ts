import mysql from 'mysql2';
import { pool } from "../../database/config";

//============TYPES============\\

type TableT = "menus" | "sections" | "foods";

//============INTERFACES============\\

interface QueryI {
  table: TableT;
}

interface SelectI extends QueryI {
  columns?: string[];
  where?: { [key: string]: FilterI };
}

interface FilterI {
  equal?: string;
  in?: string[];
}

interface InsertI extends QueryI {
  values: { [column: string]: any };
}

interface UpdateI extends QueryI {
  values: { [column: string]: any };
  where?: { [key: string]: FilterI };
}

interface DeleteI extends QueryI {
  where?: { [key: string]: FilterI };
}

//============PRIVATE============\\

const query = async <T>(query: string, values?: any[]) => {
  const [rows] = await pool.query(query, values);
  return rows as T[];
};

export const select = async <T>({ table, columns, where }: SelectI) => {
  const result = await query<T>(
    `SELECT ${columns ? formatColumns(columns) : "*"} FROM ${table} ${
      where ? "WHERE " + buildWhere(where) : ";"
    }`,
  );
  return result;
};

export const insert = async ({ table, values }: InsertI) => {
  if (Object.keys(values).length === 0) return;
  const result = await query<mysql.ResultSetHeader>(
    `INSERT INTO ${table} (${Object.keys(values).join(",")}) VALUES (${Object.values(
      values,
    )
      .map(() => "?")
      .join(",")})`,
    Object.values(values),
  );
  return result;
};

export const update = async ({ table, values, where }: UpdateI) => {
  if (Object.keys(values).length === 0)
    return;

  const result = await query<mysql.ResultSetHeader>(
    `UPDATE ${table} SET ${Object.keys(values).map((col) => `${col}=?`).join(" , ")} ${
      where ? "WHERE " + buildWhere(where) : ";"
    }`,
    Object.values(values),
  );
  return result;
};

export const remove = async ({ table, where }: DeleteI) => {
  const result = await query<mysql.ResultSetHeader>(
    `DELETE FROM ${table} ${where ? "WHERE " + buildWhere(where) : ";"}`,
  );
  return result;
};

//============SUPPORT============\\

const buildWhere = (where: any) => {
  let query: any = "";
  for (const col of Object.keys(where)) {
    for (const operation of Object.keys(where[col])) {
      switch (operation) {
        case "in":
          query += `${col} IN(${formatColumns(where[col][operation])});`;
          break;
        case "equal":
          query += `${col} = ${where[col][operation]}`;
      }
    }
  }

  return query;
};

const formatColumns = (columns: string[]) => {
  return columns.map((col: string) => `\'${col}\'`).join(",");
};
