import pkg from "pg";
const { Client } = pkg;

export const client = new Client();

let initialized = false;

const initClient = async () => {
  await client.connect();
  initialized = true;
};

export const getSessions = async () => {
  if (!initialized) initClient();

  const res = await client.query(
    "SELECT SessionID, Title, Abstract, Created, Updated FROM Sessions ORDER BY Updated DESC"
  );
  return res.rows;
};

export const getSession = async (id) => {
  if (!initialized) initClient();

  const res = await client.query(
    "SELECT SessionID, Title, Abstract, Created, Updated FROM Sessions WHERE SessionID = $1",
    [id]
  );
  return res.rows[0];
};

export const getCFPs = async (id) => {
  if (!initialized) initClient();

  const res = await client.query(
    "SELECT CFPID, SessionID, Conference, ConferenceDate, Accepted, SubmissionDate, URL FROM Cfp WHERE SessionID = $1",
    [id]
  );

  return res.rows;
};

export const acceptCFP = async (id) => {
  if (!initialized) initClient();

  const res = await client.query(
    "UPDATE Cfp SET Accepted = true WHERE CFPID = $1 RETURNING *",
    [id]
  );
  console.log(res.rows[0]);
  return res.rows[0];
};

export const createSession = async (title, abstract) => {
  if (!initialized) initClient();

  const query =
    "INSERT INTO Sessions(Title, Abstract, Created, Updated) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [title, abstract, new Date(), new Date()];

  const res = await client.query(query, values);
  return res.rows[0];
};

export const updateSession = async (sessionID, title, abstract) => {
  if (!initialized) initClient();

  const query =
    "UPDATE Sessions SET Title = $1, Abstract = $2, Updated = $3 WHERE SessionID = $4 RETURNING *";
  const values = [title, abstract, new Date(), sessionID];

  const res = await client.query(query, values);
  return res.rows[0];
};

export const createCFP = async (
  sessionID,
  conference,
  conferenceDate,
  submissionDate,
  URL
) => {
  if (!initialized) initClient();
  const query =
    "INSERT INTO Cfp(SessionID, Conference, ConferenceDate, Accepted, SubmissionDate, URL) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
  const values = [
    sessionID,
    conference,
    conferenceDate,
    0,
    submissionDate,
    URL,
  ];

  const res = await client.query(query, values);
  return res.rows[0];
};
