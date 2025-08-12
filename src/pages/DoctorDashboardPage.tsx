import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
    // Canonical URL
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `${window.location.origin}/medecin`);
  }, []);

  const [doctorName] = useState('Dr. Ndiaye');
  const [appointments] = useState<Appointment[]>([
    { id: 1, heure: '08:30', patient: 'Diop Aïda', motif: 'Suivi post-op', priorite: 'Moyenne' },
    { id: 2, heure: '09:15', patient: 'Ba Rokhaya', motif: 'Douleurs thoraciques', priorite: 'Élevée' },
    { id: 3, heure: '10:00', patient: 'Fall Mamadou', motif: 'Résultats analyses', priorite: 'Faible' },
    { id: 4, heure: '11:20', patient: 'Sy Ousmane', motif: 'Consultation générale', priorite: 'Moyenne' },
  ]);

  interface PatientRecord {
    id: number;
    nom: string;
    age: number;
    sexe?: 'H' | 'F';
    allergies?: string[];
    antecedents?: string[];
    derniereConsultation?: string;
    constantes?: { tension?: string; frequence?: number; temperature?: number; saturation?: number };
    notes?: string;
    medecin?: string;
  }

  const patientRecords: PatientRecord[] = [
    {
      id: 101,
      nom: 'Diop Aïda',
      age: 34,
      sexe: 'F',
      allergies: ['Pénicilline'],
      antecedents: ['Appendicectomie 2015'],
      derniereConsultation: '2024-11-28',
      constantes: { tension: '12/7', frequence: 76, temperature: 36.8, saturation: 98 },
      notes: 'Suivi post-op normal.',
      medecin: 'Dr. Ndiaye',
    },
    {
      id: 102,
      nom: 'Ba Rokhaya',
      age: 72,
      sexe: 'F',
      allergies: [],
      antecedents: ['HTA', 'Diabète type 2'],
      derniereConsultation: '2024-11-25',
      constantes: { tension: '15/9', frequence: 88, temperature: 37.2, saturation: 96 },
      notes: 'Évaluer douleurs thoraciques, ECG à prévoir.',
      medecin: 'Dr. Ndiaye',
    },
    {
      id: 103,
      nom: 'Fall Mamadou',
      age: 56,
      sexe: 'H',
      allergies: ['AINS'],
      antecedents: ['Hypercholestérolémie'],
      derniereConsultation: '2024-11-20',
      constantes: { tension: '13/8', frequence: 72, temperature: 36.7, saturation: 99 },
      notes: 'Remettre résultats analyses.',
      medecin: 'Dr. Sarr',
    },
    {
      id: 104,
      nom: 'Sy Ousmane',
      age: 28,
      sexe: 'H',
      allergies: [],
      antecedents: [],
      derniereConsultation: '2024-10-12',
      constantes: { tension: '11/7', frequence: 70, temperature: 36.5, saturation: 99 },
      notes: 'Consultation générale.',
      medecin: 'Dr. Ndiaye',
    },
  ];

  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isRecordOpen, setIsRecordOpen] = useState(false);

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
    const found = patientRecords.find(p => p.nom === name) || null;
    setSelectedPatient(found || { id: 0, nom: name, age: 0 });
    setIsRecordOpen(true);
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

      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dossier patient — {selectedPatient?.nom || 'Inconnu'}</DialogTitle>
            <DialogDescription>Aperçu des informations essentielles.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Âge</p>
                <p className="font-medium">{selectedPatient?.age ? `${selectedPatient?.age} ans` : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">{selectedPatient?.sexe || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="font-medium">{selectedPatient?.allergies?.length ? selectedPatient.allergies.join(', ') : 'Aucune'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Antécédents</p>
                <p className="font-medium">{selectedPatient?.antecedents?.length ? selectedPatient.antecedents.join(', ') : '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Dernière consultation</p>
                <p className="font-medium">{selectedPatient?.derniereConsultation || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Constantes</p>
                <p className="font-medium">
                  {selectedPatient?.constantes
                    ? `TA ${selectedPatient.constantes.tension || '—'} | FC ${selectedPatient.constantes.frequence || '—'} | T° ${selectedPatient.constantes.temperature || '—'} | SpO₂ ${selectedPatient.constantes.saturation || '—'}%`
                    : '—'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium whitespace-pre-wrap">{selectedPatient?.notes || '—'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordOpen(false)}>Fermer</Button>
            <Button onClick={() => window.print()}><FileText className="h-4 w-4 mr-2" />Imprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
};

export default DoctorDashboardPage;
