<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import { push } from 'svelte-spa-router';
	import { newNotificationTrigger } from "./store";
</script>

<div class="container py-5">
	<div class="row justify-content-center">
		<div class="col-lg-10">
			<div class="card shadow-sm">
				<div
					class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
				>
					<h2 class="h5 mb-0" id="app-title"><a href="#/" class="text-white text-decoration-none">INBOX VIEWER</a></h2>
					 <div>
						<button 
          				class="btn btn-light"
						on:click={ () => { $newNotificationTrigger++; push('/new'); } }
		  				>New Notification</button>
						<button 
          				class="btn btn-light"
						on:click={ () => push('/configure')} 
		  				>&#x2699;&#xFE0F;</button>
					</div>
				</div>

				<div class="card-body">
					<Router {routes} />
				</div>
			</div>
			<footer class="text-center text-muted small mt-3">
				Inbox Viewer is developed by <a href="https://lib.ugent.be" class="link-secondary">Ghent University Library</a>
				for the <a href="https://coar-notify.net" class="link-secondary">COAR Notify</a> project.
				<a href="https://github.com/MellonScholarlyCommunication/inbox-validator-app" class="link-secondary">Source code</a> on GitHub.
			</footer>
		</div>
	</div>
</div>
