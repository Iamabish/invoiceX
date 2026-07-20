"use client";

import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  ShieldAlert,
  Upload,
  Loader2,
  Check,
  KeyRound,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Field from "./Field";
import { getPasswordStrength } from "@/app/utils/helper"
import { changePassword, deleteAccount, updateProfile } from "@/app/actions/user";
import uploadCloudinary from "@/app/actions/upload";

type Tab = "profile" | "security" | "danger";

const tabs: { id: Tab; label: string; icon: typeof User; hint: string }[] = [
  { id: "profile", label: "Profile", icon: User, hint: "Name & photo" },
  { id: "security", label: "Security", icon: Lock, hint: "Password" },
  { id: "danger", label: "Danger Zone", icon: ShieldAlert, hint: "Delete account" },
];

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

const Settings = ({ user }: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user.name,
    image: user.image ?? "",
  });

  const isProfileDirty =
    profile.name !== user.name || profile.image !== (user.image ?? "");

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const passwordStrength = getPasswordStrength(password.next);

  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    setError("");
    setSaved(false);
  }, [activeTab]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    setError("");

      const result = await updateProfile({
            name: profile.name,
            image: profile.image,
        });

        setSaving(false);

        if (!result.success) {
            setError(result.error || "");
            return;
        }

        setSaved(true);
        router.refresh();

        setTimeout(() => {
            setSaved(false);
        }, 2000);
  };

  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
    ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSaving(true);

    const result = await uploadCloudinary(file);

    setSaving(false);

    if (!result.success) {
        setError(result.error || '');
        return;
    }

    setProfile((prev) => ({
        ...prev,
        image: result?.data?.secure_url,
    }));
    };

 const handleChangePassword = async () => {
  setError("");
  setSaved(false);

  if (password.next !== password.confirm) {
    setError("New passwords don't match.");
    return;
  }

  if (password.next.length < 8) {
    setError("New password must be at least 8 characters.");
    return;
  }

  setSaving(true);

  const result = await changePassword({
    currentPassword: password.current,
    newPassword: password.next,
  });

  setSaving(false);

  if (!result.success) {
    setError(result.error || "");
    return;
  }

  setSaved(true);
  setPassword({
    current: "",
    next: "",
    confirm: "",
  });

  setTimeout(() => {
    setSaved(false);
  }, 2000);
};

    const handleDeleteAccount = async () => {
    setError("");
    setDeleting(true);

    const result = await deleteAccount({
        confirmPassword : deleteConfirmText
    })

    setDeleting(false);

    if (!result.success) {
        setError(result.error || "");
        return;
    }

    router.push("/");
    };

  return (
    <section className="min-h-screen bg-ix-base px-4 py-5 sm:px-6 lg:p-8">
      <div className="mb-8 flex items-center gap-3.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ix-teal-pale ring-1 ring-inset ring-ix-teal/15">
          <SettingsIcon className="h-5 w-5 text-ix-teal" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ix-charcoal/60">
            Account
          </p>
          <h1 className="text-2xl font-medium leading-tight text-ix-dark">
            Settings
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav className="card-surface flex shrink-0 gap-1 overflow-x-auto p-2 lg:sticky lg:top-8 lg:w-64 lg:flex-col lg:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-ix-teal-pale text-ix-teal"
                    : "text-ix-charcoal hover:bg-ix-elevated"
                }`}
              >
                {active && (
                  <span className="absolute inset-y-1.5 left-0 hidden w-0.5 rounded-full bg-ix-teal lg:block" />
                )}
                <Icon
                  className="h-4 w-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
                  strokeWidth={1.5}
                />
                <span className="flex flex-col">
                  <span>{tab.label}</span>
                  <span className="hidden text-xs font-normal text-ix-charcoal/50 lg:block">
                    {tab.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="card-surface min-w-0 flex-1 p-5 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-ix-status-overdue/30 bg-ix-status-overdue/5 px-4 py-3 text-sm text-ix-status-overdue">
              <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-ix-dark">Profile</h2>
                <p className="text-sm text-ix-charcoal">
                  Update your personal information
                </p>
              </div>

              <div className="flex items-center gap-5">
                <label className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-ix-teal-pale text-lg font-semibold text-ix-teal ring-1 ring-inset ring-ix-teal/15 transition-opacity">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.name.slice(0, 2).toUpperCase()
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-ix-dark/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Upload className="h-4 w-4 text-white" strokeWidth={1.5} />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                    handleImageUpload}
                  />
                </label>
                <div>
                  <p className="text-sm font-medium text-ix-dark">
                    Profile photo
                  </p>
                  <p className="text-xs text-ix-charcoal/60">
                    JPG or PNG, up to 5MB
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Zero"
                    className="ix-input"
                  />
                </Field>
                <Field label="Email address">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="ix-input cursor-not-allowed opacity-60"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-ix-border pt-6">
                {saved && <SavedBadge label="Saved" />}
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !isProfileDirty}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-ix-dark">Security</h2>
                <p className="text-sm text-ix-charcoal">
                  Update your password to keep your account secure
                </p>
              </div>

              <div className="grid gap-5 sm:max-w-md">
                <Field label="Current password">
                  <input
                    type="password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, current: e.target.value }))
                    }
                    className="ix-input"
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="New password">
                  <input
                    type="password"
                    value={password.next}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, next: e.target.value }))
                    }
                    className="ix-input"
                    autoComplete="new-password"
                  />
                  {password.next.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex h-1 flex-1 gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`h-full flex-1 rounded-full transition-colors ${
                              passwordStrength.score > i
                                ? passwordStrength.color
                                : "bg-ix-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-ix-charcoal/60">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </Field>
                <Field label="Confirm new password">
                  <input
                    type="password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, confirm: e.target.value }))
                    }
                    className="ix-input"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-ix-border pt-6 sm:max-w-md">
                {saved && <SavedBadge label="Updated" />}
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !password.current || !password.next}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" strokeWidth={1.5} />
                  )}
                  {saving ? "Updating..." : "Update password"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-ix-dark">
                  Danger Zone
                </h2>
                <p className="text-sm text-ix-charcoal">
                  Irreversible actions — proceed with caution
                </p>
              </div>

              <div className="rounded-xl border border-ix-status-overdue/30 bg-ix-status-overdue/5 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ix-status-overdue/10">
                      <Trash2
                        className="h-4 w-4 text-ix-status-overdue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-ix-dark">
                        Delete account
                      </p>
                      <p className="text-sm text-ix-charcoal">
                        Permanently delete your account, invoices, and
                        clients. This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleting((d) => !d)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ix-status-overdue px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    Delete account
                  </button>
                </div>

                {deleting && (
                  <div className="mt-5 border-t border-ix-status-overdue/20 pt-5">
                    <p className="text-sm text-ix-charcoal">
                      Type{" "}
                      <span className="font-mono font-medium text-ix-dark">
                        delete
                      </span>{" "}
                      to confirm.
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="delete"
                        className="ix-input sm:max-w-[200px]"
                      />
                      <button
                        // onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "delete"}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-ix-status-overdue px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                      >
                        <Loader2 className="hidden h-4 w-4 animate-spin" />
                        Confirm deletion
                      </button>
                      <button
                        onClick={() => {
                          setDeleting(false);
                          setDeleteConfirmText("");
                        }}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-ix-charcoal transition-colors hover:bg-ix-elevated"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export function SavedBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-ix-status-paid">
      <Check className="h-4 w-4" strokeWidth={2} />
      {label}
    </span>
  );
}

export default Settings;