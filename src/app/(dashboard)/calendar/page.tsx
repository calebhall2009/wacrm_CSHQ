"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Appointment = {
  id: string;
  title: string;
  date: Date;
  time: string;
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Estado para el formulario
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchAppointments = async (year: number, month: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/appointments?year=${year}&month=${month}`)
      if (res.ok) {
        const data = await res.json()
        setAppointments(data.map((a: any) => ({
          id: a.id,
          title: a.title,
          date: new Date(a.date),
          time: new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments(currentDate.getFullYear(), currentDate.getMonth())
  }, [currentDate.getFullYear(), currentDate.getMonth()])

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newTitle || !newTime) return;

    // Build the full date time
    const [hours, minutes] = newTime.split(':')
    const fullDate = new Date(selectedDate)
    fullDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, date: fullDate.toISOString() })
      })
      if (res.ok) {
        const data = await res.json()
        setAppointments([
          ...appointments,
          {
            id: data.id,
            title: data.title,
            date: new Date(data.date),
            time: newTime
          }
        ]);
      }
    } catch (e) {
      console.error(e)
    }
    
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewTime("");
  };

  const openAddModal = (date?: Date) => {
    setSelectedDate(date || new Date());
    setIsAddModalOpen(true);
  };

  const openViewModal = (date: Date) => {
    setSelectedDate(date);
    setIsViewModalOpen(true);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(app => 
      app.date.getDate() === date.getDate() &&
      app.date.getMonth() === date.getMonth() &&
      app.date.getFullYear() === date.getFullYear()
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const grid = [];
  for (let i = 0; i < firstDay; i++) {
    grid.push(<div key={`empty-${i}`} className="min-h-[100px] border border-border bg-muted/20 rounded-md p-2" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = 
      day === new Date().getDate() && 
      currentDate.getMonth() === new Date().getMonth() && 
      currentDate.getFullYear() === new Date().getFullYear();

    const dayAppointments = getAppointmentsForDate(cellDate);

    grid.push(
      <div 
        key={`day-${day}`} 
        onClick={() => openViewModal(cellDate)}
        className={`min-h-[100px] border rounded-md p-2 flex flex-col gap-1 transition-colors hover:bg-muted/50 cursor-pointer ${
          isToday ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border bg-card'
        }`}
      >
        <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
          {day}
        </span>
        <div className="flex flex-col gap-1 overflow-hidden">
          {dayAppointments.slice(0, 3).map(app => (
            <div key={app.id} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate">
              {app.time} - {app.title}
            </div>
          ))}
          {dayAppointments.length > 3 && (
            <div className="text-[10px] text-muted-foreground font-medium px-1">
              + {dayAppointments.length - 3} más
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedDateApps = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendario
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona tus citas y reuniones programadas.
          </p>
        </div>
        <Button onClick={() => openAddModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {grid}
          </div>
        </CardContent>
      </Card>

      {/* Modal para Ver Citas del Día */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Citas para el {selectedDate?.getDate()} de {selectedDate ? monthNames[selectedDate.getMonth()] : ''}
            </DialogTitle>
            <DialogDescription>
              Resumen de las reuniones agendadas para esta fecha.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedDateApps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No hay citas programadas para este día.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedDateApps.map(app => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{app.title}</p>
                      <p className="text-xs text-muted-foreground">{app.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false);
              openAddModal(selectedDate || new Date());
            }}>
              Agregar Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Agregar Nueva Cita */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Programar Nueva Cita</DialogTitle>
            <DialogDescription>
              Llena los datos para guardar la cita en tu calendario.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAppointment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Cita</Label>
                <Input 
                  id="title" 
                  placeholder="Ej. Limpieza dental con María" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split('-');
                      setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cita</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
