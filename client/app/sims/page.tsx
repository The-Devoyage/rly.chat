import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Alert } from "@heroui/alert";
import { CreateSimButton } from "./components";
import { MountSimButton } from "./components/mount-sim-button";

export default function MountSimPage() {
  return (
    <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
      <Alert
        color="primary"
        description="A SIM on rly.chat is just like a SIM Card in your phone. It's how messages get to you."
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
            <CreateSimButton />
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
            <b>Mount SIM</b>
            <MountSimButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
