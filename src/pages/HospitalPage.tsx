import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { EditableTable, Column } from '@/components/ui/editable-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Activity, Stethoscope } from 'lucide-react';

const HospitalPage = () => {
  // SEO basics
  useEffect(() => {
    document.title = "Gestion de l'Hôpital | HMS";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "Tableau de gestion hospitalière: patients, médecins, lits et activités.");
  }, []);

  // Mock data
  const [patients, setPatients] = useState(
    [
      { id: 1, nom: 'Diop Aïda', age: 34, statut: 'En attente', medecin: 'Dr. Ndiaye' },
      { id: 2, nom: 'Fall Mamadou', age: 56, statut: 'En consultation', medecin: 'Dr. Sarr' },
      { id: 3, nom: 'Ba Rokhaya', age: 72, statut: 'Hospitalisé', medecin: 'Dr. Diagne' },
      { id: 4, nom: 'Sy Ousmane', age: 28, statut: 'Sortie', medecin: '—' },
    ]
  );

  const [medecins, setMedecins] = useState(
    [
      { id: 1, nom: 'Dr. Ndiaye', specialite: 'Cardiologie', statut: 'Actif' },
      { id: 2, nom: 'Dr. Sarr', specialite: 'Pédiatrie', statut: 'Actif' },
      { id: 3, nom: 'Dr. Diagne', specialite: 'Urgences', statut: 'De garde' },
      { id: 4, nom: 'Dr. Faye', specialite: 'Chirurgie', statut: 'Absent' },
    ]
  );

  const patientColumns: Column[] = [
    { id: 'id', header: 'ID', accessorKey: 'id', width: '64px' },
    { id: 'nom', header: 'Nom', accessorKey: 'nom' },
    { id: 'age', header: 'Âge', accessorKey: 'age', type: 'number' },
    { id: 'statut', header: 'Statut', accessorKey: 'statut', type: 'select', options: ['En attente', 'En consultation', 'Hospitalisé', 'Sortie'], isEditable: true },
    { id: 'medecin', header: 'Médecin référent', accessorKey: 'medecin', type: 'text', isEditable: true },
  ];

  const medecinColumns: Column[] = [
    { id: 'id', header: 'ID', accessorKey: 'id', width: '64px' },
    { id: 'nom', header: 'Nom', accessorKey: 'nom' },
    { id: 'specialite', header: 'Spécialité', accessorKey: 'specialite' },
    { id: 'statut', header: 'Statut', accessorKey: 'statut', type: 'select', options: ['Actif', 'De garde', 'Absent'], isEditable: true },
  ];

  const handleUpdatePatient = (rowIndex: number, columnId: string, value: any) => {
    setPatients(prev => prev.map((p, i) => i === rowIndex ? { ...p, [columnId]: value } : p));
  };

  const handleUpdateMedecin = (rowIndex: number, columnId: string, value: any) => {
    setMedecins(prev => prev.map((m, i) => i === rowIndex ? { ...m, [columnId]: value } : m));
  };

  // Simple KPIs
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const enAttente = patients.filter(p => p.statut === 'En attente').length;
    const hospitalises = patients.filter(p => p.statut === 'Hospitalisé').length;
    const medecinsActifs = medecins.filter(m => m.statut !== 'Absent').length;
    return { totalPatients, enAttente, hospitalises, medecinsActifs };
  }, [patients, medecins]);

  return (
    <PageLayout>
      <PageHeader
        title="Gestion de l'Hôpital"
        description="Supervision centralisée des patients, médecins et capacités."
        onTitleChange={() => {}}
        onDescriptionChange={() => {}}
        icon={<Building2 className="h-6 w-6" />}
        variant="compact"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="default">Nouveau patient</Button>
            <Button size="sm" variant="outline">Exporter</Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPatients}</p>
            <p className="text-muted-foreground text-sm">Total enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" /> En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.enAttente}</p>
            <p className="text-muted-foreground text-sm">À prendre en charge</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Médecins actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.medecinsActifs}</p>
            <p className="text-muted-foreground text-sm">Disponibles aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Lits occupés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.hospitalises}</p>
            <p className="text-muted-foreground text-sm">Patients hospitalisés</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-6">
        <article>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Patients</h2>
            <Badge variant="secondary">Suivi en temps réel</Badge>
          </div>
          <EditableTable
            data={patients}
            columns={patientColumns}
            onUpdate={handleUpdatePatient}
            sortable
          />
        </article>

        <article>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Médecins</h2>
            <Badge variant="outline">Ressources</Badge>
          </div>
          <EditableTable
            data={medecins}
            columns={medecinColumns}
            onUpdate={handleUpdateMedecin}
            sortable
          />
        </article>
      </section>
    </PageLayout>
  );
};

export default HospitalPage;
