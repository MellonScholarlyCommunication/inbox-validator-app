<script lang="ts">
    import { notificationData } from '../../store';
    import { validateNotification } from "../../validate";
    import { type Notification } from '../../inbox';

    interface Report {
        data: string;
        isError: boolean;
    }

    let validationReport: Report;

    notificationData.subscribe( (data) => {
        handleValidate(data) 
    });

    async function handleValidate(notification: Notification | null) {
        if (!notification) {
            return;
        }

        try {
            const result = await validateNotification(notification.data);
            validationReport = {
                data: result.data,
                isError: false
            };
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                validationReport = {
                    data: error.message,
                    isError: true
                };
            }
            else {
                validationReport = {
                    data: "Unknown error",
                    isError: true
                };
            }
        }
    }
</script>

{#if validationReport}
    <h3>Validation Report</h3>
    {#if validationReport.isError }
        <p class="error">{@html validationReport.data}</p>
    {:else}
        <p>{@html validationReport.data}</p>
    {/if}
{/if}