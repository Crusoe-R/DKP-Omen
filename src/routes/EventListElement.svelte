<script>
  import { moveToAbsence } from "$lib/editUser";
  import EventElement from "./EventElement.svelte";
  import { ask } from "@tauri-apps/plugin-dialog";

  let { event } = $props();
  let isExpanded = $state(false);
  let tentatives = $state([]);

  let unixTimestamp = event.closeTime; // Example Unix timestamp
  let formattedDate = formatUnixTime(unixTimestamp);
  function formatUnixTime(unixTime) {
    const date = new Date(unixTime * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  tentatives = event.signUps.filter(
    (signUp) => signUp.className === "Tentative"
  );

  async function askIfSure() {
    const answer = await ask(
      `Verschiebe alle Tentatives von ${event.title} zu Absence?`,
      {
        title: "Remove Absence",
        kind: "warning",
      }
    );
    return answer;
  }

  let removed = $state(false);
  async function removeTentatives() {
    if (await askIfSure()) {
      console.log(tentatives);
      tentatives.forEach((element) => {
        moveToAbsence(element.id, event.id);
      });
      removed = true;
    }
  }
</script>

<div class="bg-gray-800 m-2 rounded-md px-3 pt-3 pb-2">
  <div class="flex justify-between mb-5">
    <h1 class="font-bold">{event.title}</h1>
    <p class="opacity-50">{formattedDate}</p>
  </div>
  {#if tentatives.length > 0 && !removed}
    <div class="flex justify-between">
      <p class="text-sm text-red-500 mt-2">
        !Noch {tentatives.length} als Tentative gelistet
      </p>
      <button
        class="text-white rounded-md p-1 bg-red-600"
        onclick={removeTentatives}>Schiebe Tentative zu Absence</button
      >
    </div>
  {/if}
  <div class="flex justify-end mt-2">
    <button onclick={() => (isExpanded = !isExpanded)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="rounded-lg p-1"
      >
        {#if isExpanded}
          <path d="M6 15 12 9 18 15"></path>
        {:else}
          <path d="M6 9 12 15 18 9"></path>
        {/if}
      </svg>
    </button>
  </div>
  {#if isExpanded}
    <div class="flex justify-between mt-2">
      <p class="text-sm mt-2">Signups: {event.signUpCount}</p>
      <EventElement title={event.title} id={event.id} />
    </div>
  {/if}
</div>
