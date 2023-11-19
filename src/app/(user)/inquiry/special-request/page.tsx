'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  description: z.string().min(1),
  file: z.array(z.instanceof(File)).optional(),
});

type Schema = z.infer<typeof schema>;

export default function SpecialRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const { toast } = useToast();

  const { startUpload } = useUploadThing('imageUploader');

  const { mutate } = trpc.createSpecialRequest.useMutation({
    onSuccess: () => {
      toast({
        title: 'Request sent',
        description:
          'Your special request has been sent please wait for the approval of your request.',
      });
    },
  });

  const submit = async (data: Schema) => {
    setIsLoading(true);
    if (data.file && data.file.length > 0) {
      const res = await startUpload(data.file);

      if (!res) {
        return toast({
          variant: 'destructive',
          title: 'Oh uh! Something went wrong',
          description: 'Please try again later',
        });
      }

      const [fileResponse] = res;

      const key = fileResponse.key;
      const url = fileResponse.url;

      if (!key || !url) {
        return toast({
          variant: 'destructive',
          title: 'Oh uh! Something went wrong',
          description: 'Please try again later',
        });
      }

      mutate({
        brand: data.brand,
        model: data.model,
        description: data.description,
        key,
        url,
      });
      setIsLoading(false);
      return form.reset();
    }
    mutate({
      brand: data.brand,
      model: data.model,
      description: data.description,
    });
    setIsLoading(false);
    form.reset();
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-semibold'>Special Request</h1>
      <form
        onSubmit={form.handleSubmit(submit)}
        className='flex flex-col gap-2 pt-4'>
        <div>
          <Label htmlFor='brand'>Brand</Label>
          <Input
            error={form.formState.errors.brand}
            id='brand'
            {...form.register('brand')}
          />
        </div>
        <div>
          <Label htmlFor='model'>Model</Label>
          <Input
            id='model'
            error={form.formState.errors.model}
            {...form.register('model')}
          />
        </div>
        <Controller
          control={form.control}
          name='file'
          render={({ field }) => (
            <div>
              <Label htmlFor='file'>Attach an image(4MB)</Label>
              <Input
                id='file'
                type='file'
                onChange={(e) => field.onChange([e.currentTarget.files?.[0]])}
              />
            </div>
          )}
        />
        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            error={form.formState.errors.description}
            id='description'
            {...form.register('description')}
          />
        </div>
        <Button disabled={isLoading}>
          {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Request'}
        </Button>
      </form>
    </div>
  );
}
