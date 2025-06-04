import { prisma } from '../../lib/prisma';
import Link from 'next/link';

export default async function JobListPage({ searchParams }: { searchParams: { q?: string } }) {
  const jobs = await prisma.job.findMany({
    where: searchParams.q ? { title: { contains: searchParams.q, mode: 'insensitive' } } : {},
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Jobs</h1>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="border p-3 rounded">
            <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">
              {job.title}
            </Link>
            <p className="text-sm text-gray-600">{job.location} - {job.salaryMin} to {job.salaryMax}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
