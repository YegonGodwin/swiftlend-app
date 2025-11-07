import { useState, useCallback, useRef } from 'react';
import { validateForm } from '../utils/validation';

// Custom hook for form management with validation
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Refs to store input elements
  const inputRefs = useRef({});

  // Set value for a specific field
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it was previously invalid
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Set multiple values at once
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Set error for a specific field
  const setError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Set multiple errors at once
  const setMultipleErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  // Mark multiple fields as touched
  const setMultipleTouched = useCallback((touchedFields) => {
    setTouched(prev => ({
      ...prev,
      ...touchedFields
    }));
  }, []);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const fieldRules = validationRules[name];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.isValid) {
        setError(name, result.error);
        return false;
      }
    }

    // Remove error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  }, [validationRules, setError]);

  // Validate entire form
  const validateAllFields = useCallback(() => {
    const validation = validateForm(values, validationRules);

    setErrors(validation.errors);
    setIsValid(validation.isValid);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return validation.isValid;
  }, [values, validationRules]);

  // Handle input change
  const handleChange = useCallback((name) => (value) => {
    setValue(name, value);

    // Validate field if it was previously touched or has an error
    if (touched[name] || errors[name]) {
      validateField(name, value);
    }
  }, [setValue, validateField, touched, errors]);

  // Handle input blur
  const handleBlur = useCallback((name) => () => {
    setFieldTouched(name, true);
    validateField(name, values[name]);
  }, [setFieldTouched, validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e?.preventDefault?.();

    setIsSubmitting(true);

    try {
      const isFormValid = validateAllFields();

      if (isFormValid) {
        await onSubmit(values);
      } else {
        // Focus on first field with error
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField && inputRefs.current[firstErrorField]) {
          inputRefs.current[firstErrorField].focus();
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAllFields, values, errors]);

  // Reset form to initial state
  const reset = useCallback((newInitialValues) => {
    const resetValues = newInitialValues || initialValues;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(true);
  }, [initialValues]);

  // Reset only specific fields
  const resetFields = useCallback((fieldNames) => {
    const newValues = { ...values };
    const newErrors = { ...errors };
    const newTouched = { ...touched };

    fieldNames.forEach(name => {
      newValues[name] = initialValues[name] || '';
      delete newErrors[name];
      delete newTouched[name];
    });

    setValues(newValues);
    setErrors(newErrors);
    setTouched(newTouched);
  }, [values, errors, touched, initialValues]);

  // Get field props for input components
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChangeText: handleChange(name),
    onBlur: handleBlur(name),
    error: touched[name] ? errors[name] : null,
    ref: (ref) => {
      if (ref) {
        inputRefs.current[name] = ref;
      }
    }
  }), [values, errors, touched, handleChange, handleBlur]);

  // Check if field has error
  const hasError = useCallback((name) => {
    return !!(touched[name] && errors[name]);
  }, [touched, errors]);

  // Check if field is valid
  const isFieldValid = useCallback((name) => {
    return touched[name] && !errors[name];
  }, [touched, errors]);

  // Get all field values that are different from initial
  const getDirtyFields = useCallback(() => {
    const dirtyFields = {};
    Object.keys(values).forEach(key => {
      if (values[key] !== initialValues[key]) {
        dirtyFields[key] = values[key];
      }
    });
    return dirtyFields;
  }, [values, initialValues]);

  // Check if form has been modified
  const isDirty = useCallback(() => {
    return Object.keys(getDirtyFields()).length > 0;
  }, [getDirtyFields]);

  // Check if any field has been touched
  const isTouched = useCallback(() => {
    return Object.keys(touched).some(key => touched[key]);
  }, [touched]);

  return {
    // Values and state
    values,
    errors,
    touched,
    isSubmitting,
    isValid,

    // Setters
    setValue,
    setMultipleValues,
    setError,
    setMultipleErrors,
    setFieldTouched,
    setMultipleTouched,

    // Validation
    validateField,
    validateAllFields,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Utility functions
    reset,
    resetFields,
    getFieldProps,
    hasError,
    isFieldValid,
    getDirtyFields,
    isDirty,
    isTouched,

    // Refs
    inputRefs,
  };
};

// Hook for async form validation
export const useAsyncForm = (initialValues = {}, validationRules = {}, asyncValidators = {}) => {
  const form = useForm(initialValues, validationRules);
  const [asyncErrors, setAsyncErrors] = useState({});
  const [isValidatingAsync, setIsValidatingAsync] = useState(false);

  // Validate field asynchronously
  const validateFieldAsync = useCallback(async (name, value) => {
    const asyncValidator = asyncValidators[name];
    if (!asyncValidator) return true;

    setIsValidatingAsync(true);

    try {
      const result = await asyncValidator(value);
      if (!result.isValid) {
        setAsyncErrors(prev => ({
          ...prev,
          [name]: result.error
        }));
        return false;
      } else {
        setAsyncErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        return true;
      }
    } catch (error) {
      setAsyncErrors(prev => ({
        ...prev,
        [name]: 'Validation failed. Please try again.'
      }));
      return false;
    } finally {
      setIsValidatingAsync(false);
    }
  }, [asyncValidators]);

  // Enhanced handle change with async validation
  const handleChangeAsync = useCallback((name) => async (value) => {
    form.handleChange(name)(value);

    // Debounce async validation
    setTimeout(async () => {
      if (form.values[name] === value) {
        await validateFieldAsync(name, value);
      }
    }, 500);
  }, [form, validateFieldAsync]);

  // Enhanced submit with async validation
  const handleSubmitAsync = useCallback((onSubmit) => async (e) => {
    e?.preventDefault?.();

    form.setIsSubmitting(true);

    try {
      // First run sync validation
      const isSyncValid = form.validateAllFields();

      if (isSyncValid) {
        // Run async validations
        const asyncValidationPromises = Object.entries(asyncValidators).map(
          async ([fieldName, validator]) => {
            const result = await validator(form.values[fieldName]);
            return { fieldName, result };
          }
        );

        const asyncResults = await Promise.all(asyncValidationPromises);
        const newAsyncErrors = {};
        let hasAsyncErrors = false;

        asyncResults.forEach(({ fieldName, result }) => {
          if (!result.isValid) {
            newAsyncErrors[fieldName] = result.error;
            hasAsyncErrors = true;
          }
        });

        setAsyncErrors(newAsyncErrors);

        if (!hasAsyncErrors) {
          await onSubmit(form.values);
        }
      }
    } catch (error) {
      console.error('Async form submission error:', error);
    } finally {
      form.setIsSubmitting(false);
    }
  }, [form, asyncValidators]);

  return {
    ...form,
    asyncErrors,
    isValidatingAsync,
    validateFieldAsync,
    handleChange: handleChangeAsync,
    handleSubmit: handleSubmitAsync,
    allErrors: { ...form.errors, ...asyncErrors },
  };
};

export default useForm;
