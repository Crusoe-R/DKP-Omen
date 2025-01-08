import { fetch } from "@tauri-apps/plugin-http";
import { load } from "@tauri-apps/plugin-store";

async function loadkeys() {

  const store = await load("store.json", { autoSave: false });
  const loadapiKey = await store.get("API_KEY");
  const loadNote = await store.get("NOTE");
  return [ loadapiKey.value, loadNote.value ];
}

export async function moveToAbsence(userId: string, eventId:string){

    const [loadapiKey, loadNote] = await loadkeys();  
    const apiKey = loadapiKey;
    const note = loadNote;
    const url = `https://raid-helper.dev/api/v2/events/${eventId}/signups/${userId}`
    const data = {
        className: "Absence",
        reason: "moved through auto-app-move, not attended" + ` (${note})`,
      };
      try {
        fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to patch data");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
        console.log("error beim versuchen");
      } 


}

export default {moveToAbsence}