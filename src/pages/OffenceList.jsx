// src/pages/OffenceList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, Table, Badge, Button, Input, Select } from '../components/ui';
import { apiClient } from '../services/apiClient';
import { formatCurrency } from '../utils/formatters';

function OffenceList() {
  const [offences, setOffences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchOffences() {
      setLoading(true);
      try {
        const res = await apiClient.get('/offence-types');
        const list = res.data?.data || res.data || [];
        if (isMounted) {
          setOffences(Array.isArray(list) ? list : list.offenceTypes || []);
        }
      } catch (err) {
        console.error('Failed to load offence types:', err);
        if (isMounted) {
          // Fallback initial catalogue if backend not reachable
          setOffences([
            { id: '1', code: 'SP01', title: 'Speed Limit Violation (>20km/h)', category: 'Moving', penalty_amount: 15000, demerit_points: 3, is_active: 1 },
            { id: '2', code: 'RL02', title: 'Running Red Traffic Signal', category: 'Safety', penalty_amount: 25000, demerit_points: 4, is_active: 1 },
            { id: '3', code: 'SB03', title: 'Failure to Fasten Seatbelt', category: 'Safety', penalty_amount: 5000, demerit_points: 1, is_active: 1 },
            { id: '4', code: 'DD04', title: 'Driving Under Influence (DUI)', category: 'Criminal', penalty_amount: 50000, demerit_points: 6, is_active: 1 },
            { id: '5', code: 'IP05', title: 'Illegal / Obstruction Parking', category: 'Stationary', penalty_amount: 10000, demerit_points: 2, is_active: 1 },
            { id: '6', code: 'PH06', title: 'Mobile Phone Use While Driving', category: 'Distraction', penalty_amount: 10000, demerit_points: 2, is_active: 1 },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOffences();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = Array.from(new Set(offences.map((o) => o.category).filter(Boolean)));

  const filteredOffences = offences.filter((item) => {
    const matchesSearch =
      !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.code?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      label: 'Offence Code',
      key: 'code',
      render: (val) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Violation Title',
      key: 'title',
      render: (val, row) => (
        <div>
          <p className="font-bold text-xs text-slate-900">{val}</p>
          {row.description && (
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      label: 'Category',
      key: 'category',
      render: (val) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
          {val || 'General'}
        </span>
      ),
    },
    {
      label: 'Statutory Penalty',
      key: 'penalty_amount',
      render: (val) => (
        <span className="font-mono font-bold text-xs text-slate-900">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      label: 'Demerit Points',
      key: 'demerit_points',
      align: 'center',
      render: (val) => (
        <span className="font-mono font-bold text-xs text-amber-600">
          +{val || 0} pts
        </span>
      ),
    },
    {
      label: 'Catalogue Status',
      key: 'is_active',
      render: (val) => (
        <Badge variant={val ? 'success' : 'neutral'}>
          {val ? 'Enforceable' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Offence Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard schedule of traffic offences, statutory penalties, and demerit points.
          </p>
        </div>

        <Link to="/incidents/register">
          <Button variant="primary" size="md" icon={Plus} className="font-bold">
            Record Incident
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
          <div className="w-full sm:w-72">
            <Input
              icon={Search}
              placeholder="Search by code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredOffences}
          loading={loading}
          emptyMessage="No offence types found matching your query."
        />
      </Card>
    </div>
  );
}

export default OffenceList;
