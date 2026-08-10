"use client";

import { useEffect, useMemo, useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    const saved = localStorage.getItem("contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const companies = useMemo(
    () =>
      [...new Set(contacts.map((c) => c.company).filter(Boolean))].sort(),
    [contacts]
  );

  const filtered = useMemo(() => {
    let data = contacts.filter((c) => {
      const text = search.toLowerCase();

      return (
        (c.name.toLowerCase().includes(text) ||
          c.email.toLowerCase().includes(text) ||
          c.phone.includes(text) ||
          c.company.toLowerCase().includes(text)) &&
        (company === "All" || c.company === company)
      );
    });

    return [...data].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return b.id - a.id;
    });
  }, [contacts, search, company, sort]);

  const initials = (name: string) =>
    name
      .trim()
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Contact) => {
    setEditing(c.id);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
    });
    setShowForm(true);
  };

  const saveContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      alert("Please fill name, email and phone.");
      return;
    }

    if (editing) {
      setContacts((list) =>
        list.map((c) =>
          c.id === editing ? { ...c, ...form } : c
        )
      );
    } else {
      setContacts((list) => [
        ...list,
        { ...form, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const removeContact = (id: number) => {
    if (confirm("Delete this connection?")) {
      setContacts((list) => list.filter((c) => c.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-[#070711] text-white">

      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">

        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs tracking-[0.3em] text-slate-500">
                CONTACT MANAGEMENT
              </span>
            </div>

            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              Your contacts,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                all in one place.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              A personal space to keep the people,
              companies and connections that matter to you.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition hover:-translate-y-1 hover:bg-violet-100"
          >
            <span className="mr-2 text-lg">+</span>
            New Connection
          </button>
        </header>

        {/* STATS */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">

          <Stat
            title="People in the Network"
            value={contacts.length}
            icon="✦"
          />

          <Stat
            title="Companies"
            value={companies.length}
            icon="◇"
          />

          <Stat
            title="Status"
            value="ONLINE"
            icon="●"
          />

        </section>

        {/* SEARCH */}
        {contacts.length > 0 && (
          <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-4">

            <div className="grid gap-3 md:grid-cols-[1fr_200px_170px]">

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your orbit..."
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400/50"
              />

              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#0d0d19] px-4 py-4 text-sm outline-none"
              >
                <option value="All">All companies</option>
                {companies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#0d0d19] px-4 py-4 text-sm outline-none"
              >
                <option value="recent">Recent</option>
                <option value="az">Name A → Z</option>
                <option value="za">Name Z → A</option>
              </select>

            </div>
          </section>
        )}

        {/* ORBIT AREA */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-10">

          {/* stars */}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-[10%] top-[20%] text-violet-300/60">✦</span>
            <span className="absolute right-[15%] top-[18%] text-cyan-300/50">✦</span>
            <span className="absolute bottom-[20%] left-[25%] text-fuchsia-300/40">·</span>
            <span className="absolute right-[35%] bottom-[15%] text-violet-300/50">✦</span>
          </div>

          <div className="relative z-10">

            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-600">
                  Your Contact
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  My connections
                </h2>
              </div>

              <span className="text-xs text-slate-600">
                {filtered.length} Contacts
              </span>
            </div>

            {/* EMPTY */}
            {contacts.length === 0 ? (

              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/5 text-4xl text-violet-300 shadow-[0_0_70px_rgba(139,92,246,0.15)]">
                  ✦
                </div>

                <h3 className="text-xl font-semibold">
                 No Connections yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Add someone important and begin building
                  your personal network.
                </p>

                <button
                  onClick={openAdd}
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
                >
                  Add your first connection
                </button>

              </div>

            ) : filtered.length === 0 ? (

              <div className="py-24 text-center">
                <div className="text-4xl text-slate-700">⌕</div>

                <h3 className="mt-4 text-xl font-semibold">
                  No one found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {filtered.map((contact, index) => (

                  <article
                    key={contact.id}
                    className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.05]"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/10 text-sm font-bold text-violet-200">
                          {initials(contact.name)}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {contact.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-600">
                            Contact #{index + 1}
                          </p>
                        </div>

                      </div>

                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-400">
                      <p>✉ {contact.email}</p>
                      <p>⌕ {contact.phone}</p>

                      {contact.company && (
                        <p className="text-violet-300">
                          ◇ {contact.company}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-white/5 pt-4 opacity-60 transition group-hover:opacity-100">

                      <button
                        onClick={() => openEdit(contact)}
                        className="rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => removeContact(contact.id)}
                        className="rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-red-400/10 hover:text-red-300"
                      >
                        Delete
                      </button>

                    </div>

                  </article>

                ))}

              </div>
            )}

          </div>
        </section>

        <p className="mt-6 text-center text-xs tracking-widest text-slate-700">
          YOUR CONNECTIONS · YOUR NETWORK   
       </p>

      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">

          <form
            onSubmit={saveContact}
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0c0c18] p-6 shadow-2xl"
          >

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
                  {editing ? "Edit Contact" : "New Contact"}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {editing ? "Update connection" : "Add someone"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="space-y-3">

              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <Input
                placeholder="Company (optional)"
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />

            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-white py-4 text-sm font-semibold text-black transition hover:bg-violet-100"
            >
              {editing ? "Save changes" : "Create connection"}
            </button>

          </form>
        </div>
      )}

    </main>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-slate-600">
          {title}
        </p>

        <span className="text-violet-400">{icon}</span>
      </div>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400/50"
    />
  );
}