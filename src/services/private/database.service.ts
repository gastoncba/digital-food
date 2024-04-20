import mysql from "mysql2";
import { pool } from "../../database/config";

//============TYPES============\\

type TableT = "menus" | "sections" | "foods";

//============INTERFACES============\\

interface QueryI {
  table: TableT;
}

interface FilterI {
  equal?: string | number;
  greaterThan?: number;
  lessThan?: number;
  in?: (string | number)[];
  extra?: string;
}

interface OrFilter {
  [key: string]: FilterI;
}

interface WhereClause {
  [key: string]: FilterI | OrFilter;
}

interface SelectI extends QueryI {
  columns?: string[];
  where?: WhereClause;
}

interface InsertI extends QueryI {
  values: { [column: string]: any };
}

interface UpdateI extends QueryI {
  values: { [column: string]: any };
  where?: WhereClause;
}

interface DeleteI extends QueryI {
  where?: WhereClause;
}

//============PRIVATE============\\

const query = async <T>(query: string, values?: any[]) => {
  const [rows] = await pool.query(query, values);
  return rows as T;
};

export const select = async <T>({ table, columns, where }: SelectI) => {
  const result = await query<T>(`SELECT ${columns ? formatColumns(columns) : "*"} FROM ${table} ${where ? "WHERE " + buildWhere(where) : ";"}`);
  return result;
};

export const insert = async ({ table, values }: InsertI) => {
  if (Object.keys(values).length === 0) return;
  const result = await query<mysql.ResultSetHeader>(
    `INSERT INTO ${table} (${Object.keys(values).join(",")}) VALUES (${Object.values(values)
      .map(() => "?")
      .join(",")})`,
    Object.values(values)
  );
  return result;
};

export const update = async ({ table, values, where }: UpdateI) => {
  if (Object.keys(values).length === 0) return;

  const result = await query<mysql.ResultSetHeader>(
    `UPDATE ${table} SET ${Object.keys(values)
      .map((col) => `${col}=?`)
      .join(" , ")} ${where ? "WHERE " + buildWhere(where) : ";"}`,
    Object.values(values)
  );
  return result;
};

export const remove = async ({ table, where }: DeleteI) => {
  const result = await query<mysql.ResultSetHeader>(`DELETE FROM ${table} ${where ? "WHERE " + buildWhere(where) : ";"}`);
  return result;
};

//============SUPPORT============\\

const buildWhere = (where: any, condition = " AND ") => {
  let query = "";
  let isFirst = true;
  const orConditions = Object.keys(where).filter((col) => col === "or");

  for (const col of Object.keys(where)) {
    for (const operation of Object.keys(where[col])) {
      switch (operation) {
        case "in":
          query += `${!isFirst ? condition : ""} ${col} IN(${formatColumns(where[col][operation] as string[])});`;
          break;
        case "equal":
          query += `${!isFirst ? condition : ""} ${col} = ${formatValue(where[col][operation])}`;
          break;
        case "greaterThan":
          query += `${!isFirst ? condition : ""} ${col} > ${formatValue(where[col][operation])}`;
          break;
        case "lessThan":
          query += `${!isFirst ? condition : ""} ${col} < ${formatValue(where[col][operation])}`;
          break;
        case "extra":
          query += `${!isFirst ? condition : ""} ${where[col][operation]}`;
          break;
      }
      if (isFirst) isFirst = false;
    }
  }

  let orQuery = "";
  for (const cond of orConditions) {
    orQuery += buildWhere(where[cond], " OR ");
  }
  let finalQuery = query && orQuery ? `${query} AND (${orQuery})` : orQuery || query;
  return finalQuery;
};

const formatColumns = (columns: string[]) => {
  return columns.map((col: string) => col).join(",");
};

const formatValue = (value: any) => {
  if (typeof value === "number") return value;
  return `'${value}'`;
};
