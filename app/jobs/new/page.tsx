'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createJob } from '../../lib/actions';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  salaryMin: z.coerce.number().int(),
  salaryMax: z.coerce.number().int(),
  location: z.string(),
  modality: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  contract: z.string(),
  deadline: z.string(),
});

export default function JobFormPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setError('Invalid data');
      return;
    }
    const res = await createJob(parsed.data);
    if (res.ok) router.push('/jobs');
    else setError('Failed');
  }

  return (
    <form action={onSubmit} className="space-y-4 p-4 max-w-lg">
      <input name="title" placeholder="Title" className="input" />
      <textarea name="description" placeholder="Description" className="textarea" />
      <input name="salaryMin" placeholder="Salary min" type="number" className="input" />
      <input name="salaryMax" placeholder="Salary max" type="number" className="input" />
      <input name="location" placeholder="Location" className="input" />
      <select name="modality" className="input">
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="ONSITE">Onsite</option>
      </select>
      <input name="contract" placeholder="Contract" className="input" />
      <input name="deadline" type="date" className="input" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="btn-primary">Create</button>
    </form>
  );
}
