import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const clients = [
  {
    name: "Acme Inc.",
    initials: "AI",
    amount: "$8,240",
    invoices: 14,
  },
  {
    name: "Orbit Labs",
    initials: "OL",
    amount: "$5,680",
    invoices: 9,
  },
  {
    name: "Nova Studio",
    initials: "NS",
    amount: "$3,420",
    invoices: 7,
  },
  {
    name: "Pixel Agency",
    initials: "PA",
    amount: "$2,110",
    invoices: 5,
  },
];




export default async function TopClients() {


      const user = await auth.api.getSession({
        headers : await headers()
      })

      const topClinet = await prisma.invoice.groupBy({
        by : ['clientId'],
        where :{
            userId : user?.user.id,
            status : 'PAID'
        },

        _sum : {
            total : true
        },

        orderBy : {
            _sum :{
                total : 'desc'
            }
        },
        take : 5
      })


      console.log('topClient', topClinet);
      
    
  return (
    <Card className="rounded-2xl p-6">

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Top Clients
        </h2>

        <p className="text-sm text-muted-foreground">
          Highest revenue contributors
        </p>

      </div>

      <div className="space-y-5">

        {clients.map((client) => (

          <div
            key={client.name}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
          >

            <div className="flex items-center gap-3">

              <Avatar>

                <AvatarFallback>
                  {client.initials}
                </AvatarFallback>

              </Avatar>

              <div>

                <p className="font-medium">
                  {client.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  {client.invoices} invoices
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="font-semibold">
                {client.amount}
              </p>

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}