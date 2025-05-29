'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { Customer } from '@/prisma/generated/prisma';
import useCustomersQuery from './use-customers-query';

interface CustomerValue {
  name: string;
  phone: string;
  id?: string;
  address?: string;
  isNew?: boolean;
}

interface CustomerSearchFieldProps {
  value?: CustomerValue;
  onChange?: (value: CustomerValue) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomerSearchField({
  value,
  onChange,
  placeholder = 'Search customers...',
  disabled = false
}: CustomerSearchFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const { data: existingCustomers } = useCustomersQuery();

  // Update search value when value prop changes
  React.useEffect(() => {
    if (value?.name) {
      setSearchValue(value.name);
    }
  }, [value]);

  // Filter customers based on search input
  const filteredCustomers = existingCustomers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectCustomer = (customer: Customer) => {
    const customerValue: CustomerValue = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      isNew: false
    };
    setSearchValue(customer.name);
    setOpen(false);
    onChange?.(customerValue);
  };

  const handleCreateNewCustomer = () => {
    const newCustomerValue: CustomerValue = {
      name: searchValue,
      phone: '',
      address: '',
      isNew: true
    };
    setOpen(false);
    onChange?.(newCustomerValue);
  };

  const handleInputChange = (search: string) => {
    setSearchValue(search);

    // If the search exactly matches an existing customer, select it
    const exactMatch = existingCustomers?.find(
      (customer) => customer.name.toLowerCase() === search.toLowerCase()
    );
    if (exactMatch) {
      const customerValue: CustomerValue = {
        id: exactMatch.id,
        name: exactMatch.name,
        phone: exactMatch.phone,
        address: exactMatch.address,
        isNew: false
      };
      onChange?.(customerValue);
    } else {
      // Update with new customer data
      const newCustomerValue: CustomerValue = {
        name: search,
        phone: '',
        address: '',
        isNew: true
      };
      onChange?.(newCustomerValue);
    }
  };

  const displayValue = value?.name || '';
  const isExistingCustomer = value?.id && !value?.isNew;

  return (
    <div className='w-full space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
            disabled={disabled}
          >
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              {displayValue || placeholder}
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput
              placeholder='Type to search customers...'
              value={searchValue}
              onValueChange={handleInputChange}
            />
            <CommandList>
              {filteredCustomers && filteredCustomers.length > 0 && (
                <CommandGroup heading='Existing Customers'>
                  {filteredCustomers?.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.name}
                      onSelect={() => handleSelectCustomer(customer)}
                      className='flex items-center justify-between'
                    >
                      <div className='flex flex-col'>
                        <span className='font-medium'>{customer.name}</span>
                        <span className='text-muted-foreground text-sm'>
                          {customer.phone}
                        </span>
                      </div>
                      <Check
                        className={`ml-2 h-4 w-4 ${value?.id === customer.id ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchValue && filteredCustomers?.length === 0 && (
                <CommandEmpty className='px-2 py-2'>
                  <div className='flex flex-col items-center gap-2 py-2'>
                    <p className='text-muted-foreground text-sm'>
                      No existing customers found
                    </p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleCreateNewCustomer}
                      className='flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Create "{searchValue}" as new customer
                    </Button>
                  </div>
                </CommandEmpty>
              )}
              {searchValue &&
                filteredCustomers &&
                filteredCustomers.length > 0 && (
                  <CommandGroup>
                    <CommandItem onSelect={handleCreateNewCustomer}>
                      <Plus className='mr-2 h-4 w-4' />
                      Create "{searchValue}" as a new customer
                    </CommandItem>
                  </CommandGroup>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value?.name && (
        <div className='flex items-center gap-2'>
          {isExistingCustomer ? (
            <>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <User className='h-3 w-3' />
                Existing Customer
              </Badge>
              {value.phone && (
                <span className='text-muted-foreground text-sm'>
                  {value.phone}
                </span>
              )}
            </>
          ) : (
            <>
              <Badge variant='outline' className='flex items-center gap-1'>
                <Plus className='h-3 w-3' />
                New Customer
              </Badge>
              <span className='text-muted-foreground text-sm'>
                Will be created as: {value.name}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
