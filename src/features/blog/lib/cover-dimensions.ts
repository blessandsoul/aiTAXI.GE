export type CoverDimensions = { width: number; height: number }

const COVER_DIMENSIONS: Record<string, CoverDimensions> = {
    "/images/blog-covers/autonomous-vehicle-platform-supplier-due-diligence.png": { width: 1672, height: 941 },
    "/images/blog-covers/mixed-human-av-dispatch-responsibility.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-charging-schedule-order-demand.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-depot-power-capacity-pilot.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-dispatch-vendor-selection-pilot.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-fleet-integration-acceptance-criteria-georgian-pilot.png": { width: 1659, height: 948 },
    "/images/blog-covers/robotaxi-geofence-change-control-pilot.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-passenger-app-integration-scope.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-pickup-zone-blocked.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-pilot-budget-scope-categories.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-pilot-evaluation-human-taxi-baseline.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-pilot-initial-service-area-selection.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-pilot-operator-training-shift-handover.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-remote-assistance-escalation-model.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-rider-no-show-operations-workflow.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-service-interruption-playbook-passenger-launch.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-software-vendor-cybersecurity-due-diligence.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-telemetry-data-access-pilot.png": { width: 1672, height: 941 },
    "/images/blog-covers/robotaxi-vehicle-readiness-before-platform-purchase.png": { width: 1672, height: 941 },
    "/images/blog-covers/when-a-robotaxi-charging-connector-is-unavailable.png": { width: 1672, height: 941 },
}

export function getCoverDimensions(coverPath: string): CoverDimensions | undefined {
    return Object.hasOwn(COVER_DIMENSIONS, coverPath) ? COVER_DIMENSIONS[coverPath] : undefined
}
