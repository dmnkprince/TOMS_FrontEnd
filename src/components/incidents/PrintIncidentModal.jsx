// src/components/incidents/PrintIncidentModal.jsx
import React from 'react';
import {
  Printer,
  Shield,
  Car,
  Clock,
  Calendar,
  MapPin,
  AlertTriangle,
  X,
  FileCheck,
} from 'lucide-react';
import { Modal, Button } from '../ui';

export default function PrintIncidentModal({ isOpen, onClose, incident }) {
  if (!isOpen || !incident) return null;

  const handlePrint = () => {
    window.print();
  };

  const refNumber = incident.reference_number || incident.id || 'N/A';
  const plate = incident.vehiclePlate || incident.plate_number || '—';
  const mot = incident.bodyNumber && incident.bodyNumber !== '—' ? incident.bodyNumber : (incident.body_number || '—');
  const make = incident.vehicleMake && incident.vehicleMake !== 'Standard' ? incident.vehicleMake : (incident.vehicle_make || '—');
  const model = incident.vehicleModel && incident.vehicleModel !== 'Standard' ? incident.vehicleModel : (incident.vehicle_model || '—');
  const color = incident.vehicleColor && incident.vehicleColor !== 'Standard' ? incident.vehicleColor : (incident.vehicle_color || '—');
  const vType = incident.vehicleType || incident.vehicle_type || 'Car';
  const offence = incident.offenceType || incident.offences?.[0]?.title || 'Traffic Violation';
  const location = incident.location || incident.manual_location || '—';
  const state = incident.stateRegistered && incident.stateRegistered !== '—' ? incident.stateRegistered : (incident.location_description || '—');
  const date = incident.date || (incident.incident_date ? incident.incident_date.slice(0, 10) : '—');
  const time = incident.time || '—';
  const notes = incident.description && incident.description !== '—' ? incident.description : (incident.remarks || 'No additional officer notes recorded.');
  const officer = incident.registered_by || incident.agent_name || incident.agent_badge || 'Enforcement Marshal';
  const status = (incident.status || 'RECORDED').toUpperCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print Incident Citation"
      subtitle={`Ready to print citation for: ${refNumber}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full print:hidden">
          <span className="text-xs text-slate-500">
            Formatted for standard thermal or A4 page print
          </span>
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Printer}
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-900 text-white"
            >
              Print Citation
            </Button>
          </div>
        </div>
      }
    >
      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-incident-ticket,
          #printable-incident-ticket * {
            visibility: visible !important;
          }
          #printable-incident-ticket {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Printable Citation Document Container */}
      <div
        id="printable-incident-ticket"
        className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-900 font-sans shadow-xs"
      >
        {/* Header with Seal and Reference */}
        <div className="border-b-2 border-emerald-900 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
                <Shield size={26} />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase block">
                  Federal Republic of Nigeria · TOMS Enforcement
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  TRAFFIC VIOLATION CITATION
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Official Notice of Traffic Infraction & Legal Citation
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Citation No.
              </span>
              <span className="font-mono font-black text-sm text-emerald-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {refNumber}
              </span>
              <div className="mt-1">
                <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  status === 'AMENDED'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}>
                  Status: {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Car size={15} className="text-emerald-800" />
              Vehicle Identification Snapshot
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              State: {state}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Plate Number
              </span>
              <span className="font-mono font-black text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                {plate}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                MOT / Body Number
              </span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {mot}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Vehicle Type
              </span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {vType}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Make & Model
              </span>
              <span className="font-bold text-slate-800 block mt-0.5 truncate">
                {[make, model].filter((x) => x && x !== '—').join(' ') || 'Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Infraction & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-rose-700" />
              Violation Classification
            </span>
            <div className="bg-rose-50 border border-rose-200 text-rose-950 font-bold text-xs p-2.5 rounded-lg">
              {offence}
            </div>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500 font-medium">Statutory Fine:</span>
              <span className="font-mono font-black text-sm text-emerald-900">
                ₦15,000.00
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin size={15} className="text-emerald-800" />
              Time & Location Recorded
            </span>
            <div className="text-xs text-slate-800 font-semibold leading-relaxed">
              {location}
            </div>
            <div className="flex items-center justify-between text-xs pt-1 text-slate-600 border-t border-slate-100">
              <span className="flex items-center gap-1 font-mono font-bold text-emerald-900">
                <Clock size={12} /> {time}
              </span>
              <span className="flex items-center gap-1 font-mono font-semibold text-slate-600">
                <Calendar size={12} /> {date}
              </span>
            </div>
          </div>
        </div>

        {/* Officer Circumstances / Remarks */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Officer Remarks & Incident Circumstances
          </span>
          <p className="text-slate-700 leading-relaxed italic">
            "{notes}"
          </p>
        </div>

        {/* Issuing Authority & Verification Sign-Off */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Issuing Officer
            </span>
            <span className="font-black text-slate-900 block mt-0.5">
              {officer}
            </span>
            <span className="text-[11px] text-slate-500">
              Authorized Enforcement Marshal · TOMS Unit
            </span>
          </div>

          <div className="text-center sm:text-right">
            <div className="w-44 border-b border-slate-400 mb-1 mx-auto sm:ml-auto" />
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Officer Signature / Stamp Verification
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Timestamp: {new Date().toISOString()}
            </span>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-200">
          Traffic Offence Management System · This citation is an official legal record. Settle at authorized revenue centers within 14 calendar days.
        </div>
      </div>
    </Modal>
  );
}
