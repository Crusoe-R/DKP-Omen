<script>
  import Eventlist from "./Eventlist.svelte";
  import InfoTab from "./InfoTab.svelte";
  import UserList from "./UserList.svelte";

  let eventlist = $state(true);
  let userlist = $state(false);
  let localDate = $state("yess");
  const date = new Date();
  localDate = date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
</script>

<div class="w-screen h-screen bg-slate-700 text-white flex">
  <div class="w-4/5 h-screen overflow-auto no-scrollbar">
    <div class="flex justify-center mt-2 sticky top-2">
      {#if eventlist}
        <button
          class="ml-2 h-10 bg-gray-700 rounded-lg hover:bg-gray-500 hover:text-black hover:font-bold"
          onclick={() => ((eventlist = true), (userlist = false))}
          ><p class="mx-4">Events</p></button
        >
        <button
          class="ml-2 h-10 bg-gray-800 rounded-lg hover:bg-gray-500 hover:text-black hover:font-bold"
          onclick={() => ((eventlist = false), (userlist = true))}
          ><p class="mx-4">Members</p></button
        >
      {:else if userlist}
        <button
          class="ml-2 h-10 bg-gray-800 rounded-lg hover:bg-gray-500 hover:text-black hover:font-bold"
          onclick={() => ((eventlist = true), (userlist = false))}
          ><p class="mx-4">Events</p></button
        >
        <button
          class="ml-2 h-10 bg-gray-700 rounded-lg hover:bg-gray-500 hover:text-black hover:font-bold"
          onclick={() => ((eventlist = false), (userlist = true))}
          ><p class="mx-4">Members</p></button
        >
      {/if}
    </div>
    <div class="w-full">
      {#if eventlist}<Eventlist />{:else if userlist}<UserList />{/if}
    </div>
  </div>
  <div class="w-1/5 h-screen">
    <div
      class="m-2 h-5/6 p-2 rounded-md bg-gray-800 flex justify-between flex-col"
    >
      <div>
        <p class="font-bold text-xl ml-2 mt-1">{localDate}</p>
      </div>
      <InfoTab />
    </div>
  </div>
</div>
