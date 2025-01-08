<script>
  import { updateAll, updateCapped, updateSelected } from "$lib/updateDKP";
  import { fetch } from "@tauri-apps/plugin-http";
  import { load } from "@tauri-apps/plugin-store";
  import { ask } from "@tauri-apps/plugin-dialog";

  let membersData = $state([]);
  let who = $state("all");
  let what = $state("add");
  let amount = $state("0");
  let description = $state("");
  let members = $state([]);

  export async function loadData() {
    const store = await load("store.json", { autoSave: false });
    const loadapiKey = await store.get("API_KEY");
    const loadserverId = await store.get("SERVER_ID");
    const loadrollID = await store.get("ROLL_ID");

    const apiKey = loadapiKey.value;
    const serverId = loadserverId.value;
    const rollID = loadrollID.value;
    const url = `https://raid-helper.dev/api/v2/servers/${serverId}/entities/${rollID}/dkp`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        membersData = data.result;
        members = [];
        membersData.forEach((element) => {
          members.push({
            id: element.id,
            value: "0",
          });
        });
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      console.log("error beim versuchen");
    }
  }

  async function askIfSure() {
    const answer = await ask(
      "Änderungen werden auf alle Member angewendet, bist du sicher?",
      {
        title: "DKP to All Warning",
        kind: "warning",
      }
    );
    return answer;
  }

  loadData();

  async function update() {
    if (who === "all") {
      if (await askIfSure()) {
        updateAll(what, amount, description);
      }
    } else if (who === "selected") {
      members.forEach((member) => {
        if (member.value !== "0") {
          updateSelected(member.id, what, member.value, description);
        }
      });
    } else if (who === "cap") {
      members.forEach((member) => {
        if (member.dkp > 400) {
          updateCapped(member.id, member.value, description);
        }
      });
    }

    setTimeout(() => {
      loadData();
    }, 2000);
  }
</script>

<div>
  <div
    class="text-black mx-auto mt-2 w-11/12 h-40 bg-gray-800 flex flex-col rounded-md"
  >
    <div class="w-full flex mt-3 ml-2">
      <select bind:value={who} class="h-6 bg-gray-300 rounded-sm">
        <option value="all">All Members</option>
        <option value="selected">Selected Members</option>
        <option value="cap">Capped Members</option>
      </select>

      {#if who === "all"}
        <input
          type="text"
          placeholder="Amount"
          bind:value={amount}
          class="h-6 ml-5 w-48 bg-gray-300 rounded-sm"
        />
      {:else if who === "cap"}
        <p class="h-6 ml-2 text-gray-400 w-2/3">
          Member die über den Cap von 400 DKP sind (siehe rot markiert) bekommen
          die Hälfte ihres überschusses abgezogen. (Bsp. 500 -&gt; 450)
        </p>
      {/if}
      {#if who !== "cap"}
        <select
          bind:value={what}
          class="h-6 ml-auto mr-6 bg-gray-300 rounded-sm"
        >
          <option value="add">Plus</option>
          <option value="subtract">Minus</option>
          <option value="multiply">Multiplizieren</option>
          <option value="divide">Dividieren</option>
          <option value="split">Aufteilen</option>
          <option value="set">Setzen</option>
        </select>
      {/if}
    </div>
    <div class="mb-2 mt-auto h-fit w-full flex justify-between px-2">
      <textarea
        placeholder="Grund (Auktion, etc.)"
        bind:value={description}
        class="p-1 ml-1 rounded-sm w-2/3 bg-gray-300 text-black placeholder:text-neutral-800"
      ></textarea>
      <button
        class="bg-gray-400 text-black rounded-md mr-4 mt-auto mb-2 p-1 w-1/6 h-8 font-bold hover:bg-gray-300 hover:text-black active:bg-violet-600"
        onclick={update}>Update</button
      >
    </div>
  </div>
  <div class="flex flex-wrap w-11/12 mx-auto mt-3">
    {#each membersData as user}
      <div class="bg-gray-800 m-2 p-2 rounded-md w-1/12 min-w-28 max-w-40">
        <div class="w-full h-14 break-words">
          {user.name}
        </div>
        <div class="mt-2 flex justify-between">
          <p>DKP:</p>
          {#if user.dkp > 400}
            <p class="text-red-500">{user.dkp}</p>
          {:else}
            <p>{user.dkp}</p>
          {/if}
        </div>
        <div class="mt-2 mb-1 flex justify-center">
          <input
            class="w-2/3 mx-2 text-white font-bold text-center bg-gray-600"
            type="text"
            placeholder="0"
            bind:value={members[
              members.findIndex((member) => member.id === user.id)
            ].value}
          />
        </div>
      </div>
    {/each}
  </div>
</div>
