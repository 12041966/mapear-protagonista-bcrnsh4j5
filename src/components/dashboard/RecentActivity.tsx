import { useMainStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TYPE_COLORS } from '@/lib/constants'

export function RecentActivity() {
  const { observations } = useMainStore()
  const recent = [...observations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recent.map((obs) => (
            <div
              key={obs.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{obs.id}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[obs.type]}`}
                  >
                    {obs.type}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500">
                  {obs.area} • {new Date(obs.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <Badge
                variant={
                  obs.status === 'Concluído'
                    ? 'secondary'
                    : obs.status === 'Em Análise'
                      ? 'default'
                      : 'outline'
                }
                className="text-xs"
              >
                {obs.status}
              </Badge>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="text-center text-slate-500 py-4 text-sm">
              Nenhuma observação recente.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
