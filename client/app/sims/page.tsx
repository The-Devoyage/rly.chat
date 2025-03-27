import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";

export default function SimsPage() {
  return (
    <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
      <Alert
        color="primary"
        description="A SIM here is just like a SIM Card in your phone. It's how messages get to you."
        className="text-left"
      />
      <div className="flex flex-col md:flex-row w-full justify-center gap-4">
        <Card className="w-full">
          <CardBody className="overflow-visible p-0">
            <Image
              alt="Sim cards on a table."
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
              src="/sims.jpg"
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>New SIM</b>
            <Button radius="sm" href="/sims/create" as="a">
              Create
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardBody className="overflow-visible p-0">
            <Image
              alt="Sim cards on a table."
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
              src="/phone.jpg"
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>Load SIM</b>
            <Button radius="sm" href="/sims/load" as="a">
              Import
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
