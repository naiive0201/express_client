'use client';
import { Customer } from '@/types';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axios.get('/api/proxy/customers');
      setCustomers(response.data);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <p>Dashboard</p>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
}
