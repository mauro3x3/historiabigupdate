
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const FormHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Create New Learning Journey</CardTitle>
      <CardDescription>
        Add a new historical learning path for your users
      </CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
