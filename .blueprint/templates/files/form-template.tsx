/**
 * Template de formulario estándar — React Hook Form + Zod
 *
 * Copiar y adaptar. No modificar el patrón estructural.
 * Reglas aplicadas: frontend-rules.md § Formularios, conventions/naming.md § DTOs
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Alert } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Schema Zod — define validación Y tipos en un solo lugar
const exampleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  // Campos opcionales:
  description: z.string().max(500).optional(),
});

// 2. Tipo inferido del schema — no duplicar con una interface manual
type ExampleFormValues = z.infer<typeof exampleSchema>;

// 3. DTO de request al backend — puede ser el mismo tipo o una transformación
type CreateExampleDTO = ExampleFormValues;

// 4. Función de llamada a la API — va en /services, no en el componente
async function createExample(data: CreateExampleDTO): Promise<void> {
  const res = await fetch('/api/examples', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error?.message ?? 'Error inesperado');
  }
}

// 5. Componente
interface ExampleFormProps {
  onSuccess?: () => void;
}

export function ExampleForm({ onSuccess }: ExampleFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createExample,
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar listas
      queryClient.invalidateQueries({ queryKey: ['examples'] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (values: ExampleFormValues) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Error global de API — siempre mostrar, no silenciar */}
      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mutation.error instanceof Error ? mutation.error.message : 'Error inesperado'}
        </Alert>
      )}

      <TextField
        label="Nombre"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        required
      />

      <TextField
        label="Email"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        required
      />

      <TextField
        label="Descripción (opcional)"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || mutation.isPending}
        fullWidth
      >
        {mutation.isPending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
