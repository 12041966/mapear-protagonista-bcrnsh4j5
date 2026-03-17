import { useMainStore } from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function MinhasObservacoes() {
  const { observations, currentUser } = useMainStore()

  const myObs = observations.filter((o) => o.observer.cpf === currentUser?.cpf)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Minhas Observações</h2>
        <p className="text-sm text-slate-500">Acompanhe o status e as ações dos seus relatos.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>ID / Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myObs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                  Nenhum relato encontrado no seu CPF.
                </TableCell>
              </TableRow>
            ) : (
              myObs.map((obs) => (
                <TableRow key={obs.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{obs.id}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(obs.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{obs.type}</TableCell>
                  <TableCell>
                    {obs.area} - {obs.shift}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        obs.status === 'Concluído'
                          ? 'secondary'
                          : obs.status === 'Em Análise'
                            ? 'default'
                            : 'outline'
                      }
                    >
                      {obs.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
