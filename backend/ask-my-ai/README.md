# Ask my AI (backend)

A small Google Apps Script web app that powers the "Ask my AI" chat on the portfolio.

- The Gemini API key lives in **Script Properties**, never in the website code.
- Every answer comes only from the profile in `Code.gs`. Off-topic questions get a fixed reply.
- Soft limits protect the free quota: 20 questions a minute and `DAILY_LIMIT` (default 300) a day.

## Set up (about 5 minutes, on a laptop)

1. Open [script.google.com](https://script.google.com) and click **New project**. Name it `Ask my AI`.
2. Replace the contents of `Code.gs` with the `Code.gs` from this folder. Save.
3. Click the gear icon (**Project Settings**). Tick **Show "appsscript.json" manifest file**, then replace that file with `appsscript.json` from this folder.
4. Still in **Project Settings**, under **Script properties**, click **Add script property**:
   - Property: `GEMINI_API_KEY`
   - Value: your key from Google AI Studio
5. Back in the editor, choose `testBot` in the function list and click **Run**. Allow the permission prompt (it only asks to connect to an external service). Open **Executions** to see the 8 test answers: the first five should be real answers, the last three should be `on_topic: false`.
6. Click **Deploy > New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**.
7. Copy the **Web app URL** (it ends in `/exec`) and put it in the website (`window.ASK_AI_ENDPOINT`).

With clasp instead: `clasp create --type webapp --title "Ask my AI"`, copy both files in, `clasp push`, set the script property in the editor, then `clasp deploy`.

## Optional script properties

| Property | What it does |
| --- | --- |
| `GEMINI_MODEL` | Force a model, for example `gemini-2.5-flash`. Otherwise it tries 2.5 Flash, 2.5 Flash-Lite, then 2.0 Flash. |
| `DAILY_LIMIT` | Maximum questions per day (default 300). |

Questions visitors ask are listed under **Executions** in the Apps Script editor.
