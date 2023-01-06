<script lang="ts">
	import type { PageData } from "./$types";
    export var data: PageData;
</script>

<h1>Szia, {data.user.name}!</h1>
<div>
    <div>
        <h2>Adataid:</h2>
        <ul>
            <li>Id: {data.user.id}</li>
            <li>Email: {data.user.email}</li>
        </ul>
    </div>
    <div>
        <h2>Szerepkör:</h2>
        <ul>
            <li>Megnevezés: {data.user.role.name}</li>
            <li>Jogosultságok: [ {data.user.role.permissions.join(", ")} ]</li>
        </ul>
    </div>
    <div>
        <h2>Munkamenet:</h2>
        <ul>
            <li>Kiállítva: {data.issued.toLocaleString()}</li>
            <li>Lejár: {data.expires?.toLocaleString() ?? "soha"}</li>
        </ul>
    </div>
    <div>
        Nyers: {JSON.stringify(data)}
    </div>
</div>


<style lang="postcss">
    ul {
        margin-left: 1em;
    }
    div {
        margin-bottom: 1em;
    }
    h1 {
        margin-bottom: 1em;
    }
</style>