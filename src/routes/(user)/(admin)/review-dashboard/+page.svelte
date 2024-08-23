<script lang="ts">
	import SourceListPeageable from '$components/layout/lists/SourceListPeageable.svelte';
	let searchSourcesValue = '';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>
<p class="text-center">
	Peržiūrėdami užduotis būkite atlaidūs :). Gali užduotys neturėti atsakymų, gali būti netobulas
	formatavimas ar uždavinio formuluotė (t.y. nebūtina kabinėtis prie taškų). Žinutę apie smulkias
	klaidas galite perduoti ir patvirtindami šaltinį.
</p>
<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="all" />
