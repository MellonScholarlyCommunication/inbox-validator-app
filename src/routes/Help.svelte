<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { INBOX_URL, RELAY_URL, VALIDATOR_URL } from '../globals';
</script>

<h3>Inbox Viewer</h3>
<p class="text-muted">
  Browse, inspect, validate and reply to an LDN inbox holding 
  <a href="https://coar-notify.net">COAR Notify</a> /
  <a href="https://www.eventnotifications.net">Event Notifications</a> messages.
</p>

<div class="text-center my-5">
  <a href="#/inbox" class="btn btn-primary btn-lg px-5 py-3">Open the inbox</a>
</div>

<h3>Configuration</h3>

<p>Use the &#x2699;&#xFE0F; button in the top right corner to configure this inbox viewer.</p>

<b>Required</b>
<ul>
  <li>The location of an LDN inbox. (Default: {INBOX_URL})</li>
  <li>The location of a Notification validator. (Default: {VALIDATOR_URL})</li>
  <li>The location of a Notification relay service. (Default: {RELAY_URL})</li>
  <li>A relay authentication token provided by COAR Notify.</li>
</ul>

<b>Optional</b>
<ul>
  <li>Send all outgoing notifications to a fixed LDN inbox.</li>
  <li>Set your custom LDN agent and origin parameters</li>
</ul>

<h3>Inbox</h3>

<p>The inbox provides a list of all incoming LDN messages sorted by arrival date. Click on the name of the notification to get detailed information about the content of the notification and possible follow-up actions.</p>

<p>Offer notifications can be the subject of a follow-up response: 'Flagged', 'Accepted', 'Rejected' or 'Announced'. All other notification types do not have follow-up responses.</p>

<h3>New Notification</h3>

<p>A new notification can be sent by clicking the 'New Notification' button in the upper-right menu.
  The 'Offer', 'Undo' and 'Announce' forms follow the COAR Notify spec. The 'Generic' form is a wildcard. It allows you to send arbitrary JSON-LD to an LDN inbox.
</p>

<h3>Disclaimer</h3>

<p>The interface is deliberately technical, close to the raw information that is sent and received using the COAR Notify protocol. The audience of this service is technical repository and server provider managers who would like to debug their LDN service.</p>