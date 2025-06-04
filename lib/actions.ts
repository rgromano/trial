'use server';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function createJob(data: any) {
  // In real app check user role and credits
  try {
    await prisma.job.create({ data: { ...data, salaryMin: Number(data.salaryMin), salaryMax: Number(data.salaryMax), modality: data.modality } });
    revalidatePath('/jobs');
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false };
  }
}
