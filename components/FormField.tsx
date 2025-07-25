// components/FormInput.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";

export interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
}

export function FormField<T extends FieldValues>({
  label,
  name,
  control,
  error,
  ...props
}: FormFieldProps<T>) {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  return (
    <>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...props}
            style={[
              styles.input,
              props.multiline && styles.bioInput,
              {
                backgroundColor: currentColors.secondaryBg,
                color: currentColors.text,
                borderColor: error
                  ? currentColors.danger
                  : currentColors.border,
              },
            ]}
            placeholderTextColor={currentColors.secondaryText}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {error && (
        <ThemedText style={[styles.errorText, { color: currentColors.danger }]}>
          {error.message}
        </ThemedText>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    alignSelf: "flex-start",
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  errorText: { color: "#000000", alignSelf: "flex-start" },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 5,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
