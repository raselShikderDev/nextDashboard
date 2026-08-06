// components/FormSchemaBuilder.tsx
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, GripVertical } from "lucide-react";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "textarea", label: "Textarea" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "file", label: "File Upload" },
];

export function FormSchemaBuilder() {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "formSchema",
  });

  const addField = () => {
    append({
      name: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      options: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Service Form Fields</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="w-4 h-4 mr-1" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No custom fields defined. Users will only submit basic info (name, email, phone).
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldType = watch(`formSchema.${index}.type`);
          const options = watch(`formSchema.${index}.options`) || [];

          return (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-muted/30"
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-2" />
                
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {/* Field Key (machine name) */}
                  <div className="space-y-1">
                    <Label className="text-xs">Field Key</Label>
                    <Input
                      placeholder="e.g. passportNumber"
                      {...register(`formSchema.${index}.name`)}
                    />
                  </div>

                  {/* Display Label */}
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      placeholder="e.g. Passport Number"
                      {...register(`formSchema.${index}.label`)}
                    />
                  </div>

                  {/* Field Type */}
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={fieldType}
                      onValueChange={(v) =>
                        setValue(`formSchema.${index}.type`, v, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Placeholder */}
                  <div className="space-y-1">
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      placeholder="Enter value..."
                      {...register(`formSchema.${index}.placeholder`)}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Options for Select type */}
              {fieldType === "select" && (
                <div className="pl-8 space-y-2">
                  <Label className="text-xs">Options (comma separated)</Label>
                  <Input
                    placeholder="Option 1, Option 2, Option 3"
                    value={options.join(", ")}
                    onChange={(e) =>
                      setValue(
                        `formSchema.${index}.options`,
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        { shouldDirty: true }
                      )
                    }
                  />
                </div>
              )}

              {/* Required toggle */}
              <div className="pl-8 flex items-center gap-2">
                <Switch
                  checked={watch(`formSchema.${index}.required`)}
                  onCheckedChange={(v) =>
                    setValue(`formSchema.${index}.required`, v, { shouldDirty: true })
                  }
                />
                <Label className="text-xs cursor-pointer">Required field</Label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}