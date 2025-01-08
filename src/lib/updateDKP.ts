import { fetch } from "@tauri-apps/plugin-http";
import { load } from "@tauri-apps/plugin-store";

async function loadkeys() {

  const store = await load("store.json", { autoSave: false });
  const loadapiKey = await store.get("API_KEY");
  const loadserverId = await store.get("SERVER_ID");
  const loadrollID = await store.get("ROLL_ID");
  const loadNote = await store.get("NOTE");
  return [ loadapiKey.value, loadserverId.value, loadrollID.value, loadNote.value ];
}

export async function updateAll(operation: string, value: string, description:string) {
        const loadedkeys = await loadkeys();  
        const apiKey = loadedkeys[0];
        const serverId = loadedkeys[1];
        const rollID = loadedkeys[2];
        const note = loadedkeys[3];
        const url = `https://raid-helper.dev/api/v2/servers/${serverId}/entities/${rollID}/dkp`;
        const data = {
          operation: operation,
          value: value,
          description: description + ` (${note})`,
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

export async function updateSelected(id: string, operation: string, value: string, description:string) {
    const loadedkeys = await loadkeys();  
    const apiKey = loadedkeys[0];
    const serverId = loadedkeys[1];
    const note = loadedkeys[3];
    const url = `https://raid-helper.dev/api/v2/servers/${serverId}/entities/${id}/dkp`;

    const data = {
      operation: operation,
      value: value,
      description: description + ` (${note})`,
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

export function updateCapped(id: string, value: string, description:string) {
  let newValue = parseInt(value);
  if (newValue > 400) {
    newValue -= 400;
    newValue = newValue / 2;
    newValue = Math.round(newValue);
    newValue = newValue + 400;
  }
  console.log(newValue);
    updateSelected(id, "set", newValue.toString(), description);

}

export default { updateAll, updateSelected, updateCapped }; 