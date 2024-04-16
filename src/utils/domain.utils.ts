/**
 * Get subdomain e.g. https://intrust-bank.tryforesight.link/, https://intrust-bank.portal.tryforesight.link/
 *                    http://intrust-bank.localhost:5173/login
 * @returns e.g. intrust-bank
 */

import { Institution } from "@/constants/tenant.constants"
import LoanReadyFormStrategy from "@/modules/loan-application/services/formStrategies/LoanReadyFormStrategy"
import SmbFormStrategy from "@/modules/loan-application/services/formStrategies/SmbFormStrategy"

const DEFAULT_DEMO_SUBDOMAIN = "capsight"

function getSubdomain(): string {
  // return "loanready" // for testing

  try {
    const { host } = window.location
    const isDev = host.includes("localhost")
    const splitHost = host.split(".")
    const isContainPortal = splitHost.includes("portal")
    if (
      (!isDev && splitHost.length === (isContainPortal ? 4 : 3)) ||
      (isDev && splitHost.length === (isContainPortal ? 3 : 2))
    ) {
      return splitHost[0]
    }
    return DEFAULT_DEMO_SUBDOMAIN
  } catch {
    return DEFAULT_DEMO_SUBDOMAIN
  }
}

function getTenantDomain(subdomain: string) {
  try {
    return window.location.origin.replace("foresight", subdomain)
  } catch {
    return ""
  }
}

function isLoanReady(): boolean {
  return getSubdomain() === Institution.LoanReady
}

function getFormStrategy() {
  switch (getSubdomain()) {
    case Institution.LoanReady:
      return new LoanReadyFormStrategy()
    case Institution.Altcap:
      return new SmbFormStrategy()
    default:
      return new LoanReadyFormStrategy()
  }
}

export { getSubdomain, isLoanReady, getTenantDomain, getFormStrategy }
