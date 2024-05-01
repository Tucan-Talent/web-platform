import { FEATURE_FLAGS } from "@/constants/feature-flag.constants"
import { featureFlagsService } from "@/services/feature-flag.service"
import { FeatureFlagStatus } from "@/types/feature-flag.types"

export function checkEnabledFeatureFlag(key: FEATURE_FLAGS) {
  const featureFlags = featureFlagsService.getFeatureFlags()
  const featureFlag = featureFlags.find(
    (featureFlag) => featureFlag.key === key
  )
  return featureFlag?.status === FeatureFlagStatus.ON
}

export function checkEnabledFeatureFlags(keys: FEATURE_FLAGS[]) {
  return keys.every((key) => checkEnabledFeatureFlag(key))
}
