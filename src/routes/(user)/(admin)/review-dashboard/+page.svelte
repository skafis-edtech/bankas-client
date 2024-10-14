<script lang="ts">
	import SourceListPeageable from '$components/lists/SourceListPeageable.svelte';
	let searchSourcesValue = '';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Užduočių peržiūra</h1>
<p class="text-center">
	Svarbiausia - peržiūrėdami patikrinkite, ar nėra užduotys akivaizdžiai nukopijuotos nuo vadovėlio
	ar pnš. <mark><strong>UŽDUOTYS TURI BŪTI AUTORINĖS</strong></mark>. Daugiau peržiūrėdami būkite
	atlaidūs :). Gali užduotys neturėti atsakymų, gali būti netobulas formatavimas ar uždavinio
	formuluotė (t.y. nebūtina kabinėtis prie taškų). Žinutę apie smulkias klaidas galite tiesiog
	patvirtindami šaltinį.
</p>
<SourceListPeageable searchValue={searchSourcesValue} sourcesSubset="all" />
