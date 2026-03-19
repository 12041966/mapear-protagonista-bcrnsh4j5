import { useMainStore } from '@/stores/main'
import { CompanySystemTables } from './CompanySystemTables'
import { GlobalSystemTables } from './GlobalSystemTables'

export function SystemTables() {
  const { currentUser, isSuperAdmin, activeCompanyId } = useMainStore()

  if (isSuperAdmin && activeCompanyId === 'all') {
    return <GlobalSystemTables />
  }

  const targetCompanyId =
    isSuperAdmin && activeCompanyId !== 'all' ? activeCompanyId : currentUser?.companyId

  return <CompanySystemTables targetCompanyId={targetCompanyId} />
}
