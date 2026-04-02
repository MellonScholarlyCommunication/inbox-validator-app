<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import { push } from 'svelte-spa-router';
</script>

<div class="container py-5">
	<div class="row justify-content-center">
		<div class="col-lg-10">
			<div class="card shadow-sm">
				<div
					class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
				>
					<h2 class="h5 mb-0" id="app-title">INBOX VIEWER</h2>
						<button 
          				class="btn btn-light"
						on:click={ () => push('/configure')} 
		  				>Configure</button>
				</div>

				<div class="card-body">
					<Router {routes} />
				</div>
			</div>
		</div>
	</div>
</div>
