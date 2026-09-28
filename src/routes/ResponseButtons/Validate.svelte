<script lang="ts">
    import { notificationData, defaultOptions } from '../../store';
    import { validateNotification } from "../../validate";
    import { type Notification } from '../../inbox';

    let validatorApi : string;

    if ($defaultOptions) {
        validatorApi = $defaultOptions.validatorUrl;
    }

    interface Report {
        data: string;
        isError: boolean;
    }

    let validationReport: Report;
    let waitMsg : string = "";

    notificationData.subscribe( (data) => {
        handleValidate(data) 
    });

    async function handleValidate(notification: Notification | null) {
        if (!notification) {
            return;
        }

        try {
            waitMsg = "Validating…";
            const result = await validateNotification(notification.data, {
                api: validatorApi
            });
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
        finally {
            waitMsg = "";
        }
    }
</script>

{#if waitMsg}
    <div class="d-flex align-items-center gap-2 text-secondary my-3" role="status">
        <div class="spinner-border spinner-border-sm" aria-hidden="true"></div>
        <span>{waitMsg}</span>
    </div>
{:else if validationReport}
    <h3>Validation Report</h3>
    {#if validationReport.isError }
        <p class="error">{@html validationReport.data}</p>
    {:else}
        <p>{@html validationReport.data}</p>
    {/if}
{/if}
