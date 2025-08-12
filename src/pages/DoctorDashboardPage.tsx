import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CalendarDays, Clock, FileText, AlertTriangle } from 'lucide-react';

interface Appointment {
  id: number;
  heure: string;
  patient: string;
  motif: string;
  priorite: 'Faible' | 'Moyenne' | 'Élevée';
}

const DoctorDashboardPage = () => {
  // SEO basics
  useEffect(() => {
    document.title = 'Dashboard Médecin | HMS';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Vue médecin: rendez-vous du jour, accès dossiers et alertes.');
  }, []);

  const [doctorName] = useState('Dr. Ndiaye');
  const [appointments] = useState<Appointment[]>([
    { id: 1, heure: '08:30', patient: 'Diop Aïda', motif: 'Suivi post-op', priorite: 'Moyenne' },
    { id: 2, heure: '09:15', patient: 'Ba Rokhaya', motif: 'Douleurs thoraciques', priorite: 'Élevée' },
    { id: 3, heure: '10:00', patient: 'Fall Mamadou', motif: 'Résultats analyses', priorite: 'Faible' },
    { id: 4, heure: '11:20', patient: "Sy Ousmane", motif: 'Consultation générale', priorite: 'Moyenne' },
  ]);

  const counters = useMemo(() => ({
    total: appointments.length,
    haute: appointments.filter(a => a.priorite === 'Élevée').length,
  }), [appointments]);

  const priorityBadge = (p: Appointment['priorite']) => {
    const map: Record<Appointment['priorite'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }>
      = {
        'Faible': { variant: 'secondary', label: 'Faible' },
        'Moyenne': { variant: 'default', label: 'Moyenne' },
        'Élevée': { variant: 'destructive', label: 'Urgente' },
      };
    const v = map[p];
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };

  const handleOpenRecord = (name: string) => {
    console.log('Ouvrir dossier pour', name);
  };

  const handleStartConsultation = (name: string) => {
    console.log('Démarrer consultation pour', name);
  };

  return (
    <PageLayout>
      <PageHeader
        title={`Dashboard Médecin — ${doctorName}`}
        description="Vos rendez-vous du jour et accès rapide aux dossiers patients."
        onTitleChange={() => {}}
        onDescriptionChange={() => {}}
        icon={<Stethoscope className="h-6 w-6" />}
        variant="compact"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><CalendarDays className="h-4 w-4 mr-2" />Planifier</Button>
            <Button size="sm"><FileText className="h-4 w-4 mr-2" />Nouvelle note</Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counters.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cas urgents</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-2xl font-bold">{counters.haute}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prochaine consultation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <p className="text-lg">{appointments[0]?.heure || '--:--'}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Rendez-vous</h2>
        <div className="grid gap-3">
          {appointments.map(a => (
            <Card key={a.id}>
              <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {priorityBadge(a.priorite)}
                  <span className="font-medium">{a.heure}</span>
                  <span>— {a.patient}</span>
                  <span className="text-muted-foreground">({a.motif})</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenRecord(a.patient)}>Ouvrir dossier</Button>
                  <Button size="sm" onClick={() => handleStartConsultation(a.patient)}>Commencer</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default DoctorDashboardPage;
