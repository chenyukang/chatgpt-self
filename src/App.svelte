<script>
  import { Jumper } from 'svelte-loading-spinners';

  let messages = [];
  let message = '';
  let loading = false;

  const jq = window.$;


  function sendMessage() {
    console.log("new message: ", message);
    let elem = { "message": message, "bot": false};
    messages = messages.concat(elem);
    sendToBot(message);
    console.log(messages);
    message = "";
  }


  async function sendToBot (message) {
    loading = true;
		const res = await fetch('http://localhost:3000/api/chatgpt', {
			method: 'POST',
			body: JSON.stringify({
				msg: message,
			}),
      headers: {
        "content-type": "application/json"
      }
		})

    if (res.status == 200) {
		  const json = await res.json()
		  let result = JSON.stringify(json)
      console.log("result: ", result);
      console.log("result: ", json["reply"]);
      let elem = { "message": json["reply"], "bot": true};
      messages = messages.concat(elem);
    } else {
      let elem = { "message": "ChaGPT failed replied...", "bot": true};
      messages = messages.concat(elem);
    }
    loading = false;
	}
</script>

<main>
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-col w-12/12 bg-slate-900 px-8 py-8 rounded-lg">
      <h1 class="mb-10 font-bold text-gray-50 text-4xl text-center">ChatGPT</h1>

      <div class="w-full mb-4 bg-gray-300 rounded-md px-4 py-4">
          {#each messages as msg}
              {#if msg['bot'] == false }
                <div class="px-4 py-2 mb-2 bg-pink-700 rounded-md font-semibold text-gray-50 w-fit">
                  You: {msg['message']}
                </div>
              {:else}
                <div class="px-4 py-2 mb-2 bg-gray-50 rounded-md font-semibold text-gray-900 w-fit">
                  Bot: {msg['message']}
                </div>
              {/if}

          {/each}
          {#if loading}
            <Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
          {/if}
      </div>

      <div class="w-full flex">
        <input bind:value={message} class="rounded-md px-2 py-2 w-full border-0" placeholder="Message..." type="text">
        {#if loading }
          <button on:click={sendMessage} disabled=true class="rounded-md px-3 py-2 bg-pink-700 text-gray-50 border-0 ml-2">Send</button>
        {:else}
          <button on:click={sendMessage} class="rounded-md px-3 py-2 bg-pink-700 text-gray-50 border-0 ml-2">Send</button>
        {/if}
      </div>
    </div>
  </div>
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>